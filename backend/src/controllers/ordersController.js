const prisma = require('../db/prisma');
const { getIdentifier } = require('../utils/helpers');
const nodemailer = require('nodemailer');

async function sendOrderEmail(order, items, address) {
  try {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM_EMAIL } = process.env;
    
    // Only attempt to send if SMTP credentials are provided
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      console.log('⚠️ Email not sent: SMTP credentials missing from environment variables.');
      return;
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT) || 587,
      secure: parseInt(SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const itemsHtml = items.map(
      (i) => `<li>${i.quantity}x <strong>${i.product_name}</strong></li>`
    ).join('');

    const mailOptions = {
      from: SMTP_FROM_EMAIL || `"Flipkart Clone" <${SMTP_USER}>`,
      to: address.email,
      subject: `Order Confirmation - Order #${order.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #2874f0; padding: 20px; color: white; text-align: center;">
            <h2 style="margin: 0;">Order Confirmed! 🎉</h2>
          </div>
          <div style="padding: 20px;">
            <p>Hi ${address.full_name},</p>
            <p>Thank you for shopping with us! Your order <strong>#${order.id}</strong> has been placed successfully.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr style="background-color: #f1f3f6;">
                <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Items Ordered</strong></td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                  <ul style="margin: 0; padding-left: 20px;">
                    ${itemsHtml}
                  </ul>
                </td>
              </tr>
              <tr style="background-color: #f1f3f6;">
                <td style="padding: 10px;"><strong>Total Amount: ₹${parseFloat(order.total_amount).toLocaleString('en-IN')}</strong></td>
              </tr>
            </table>

            <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px;">
              <h3 style="margin-top: 0;">Shipping Address</h3>
              <p style="margin: 0; color: #555;">
                ${address.full_name}<br/>
                ${address.address_line1}, ${address.address_line2 ? address.address_line2 + ', ' : ''}<br/>
                ${address.city}, ${address.state} - ${address.pincode}<br/>
                Phone: ${address.phone}
              </p>
            </div>
          </div>
          <div style="background-color: #f1f3f6; color: #878787; text-align: center; padding: 15px; font-size: 12px;">
            <p style="margin: 0;">This is an automated email, please do not reply.</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Order confirmation email sent to ${address.email} (MessageId: ${info.messageId})`);
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    // We intentionally don't throw the error so the order placement still succeeds
  }
}

const getOrders = async (req, res) => {
  const { field, value } = getIdentifier(req);
  try {
    const orders = await prisma.orders.findMany({
      where: field === 'user_id' ? { user_id: parseInt(value) } : { session_id: value },
      orderBy: { created_at: 'desc' },
      include: {
        order_items: {
          include: {
            products: {
              include: {
                product_images: { where: { is_primary: true }, take: 1 }
              }
            }
          }
        }
      }
    });

    const formattedOrders = orders.map(o => ({
      id: o.id,
      total_amount: o.total_amount,
      status: o.status,
      address_json: o.address_json,
      created_at: o.created_at,
      items: o.order_items.map(oi => ({
        product_id: oi.product_id,
        product_name: oi.products?.name,
        quantity: oi.quantity,
        unit_price: oi.unit_price,
        image: oi.products?.product_images?.[0]?.url || null
      }))
    }));

    res.json({ orders: formattedOrders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await prisma.orders.findUnique({
      where: { id: parseInt(id) },
      include: {
        order_items: {
          include: {
            products: {
              include: { product_images: { where: { is_primary: true }, take: 1 } }
            }
          }
        }
      }
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });

    const formattedOrder = {
      ...order,
      items: order.order_items.map(oi => ({
        product_id: oi.product_id,
        product_name: oi.products?.name,
        quantity: oi.quantity,
        unit_price: oi.unit_price,
        image: oi.products?.product_images?.[0]?.url || null
      }))
    };
    delete formattedOrder.order_items;

    res.json({ order: formattedOrder });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const placeOrder = async (req, res) => {
  const { address } = req.body;
  const { field, value } = getIdentifier(req);

  if (!address || !address.full_name || !address.address_line1 || !address.city || !address.pincode || !address.phone) {
    return res.status(400).json({ error: 'Complete shipping address required' });
  }

  try {
    const transaction = await prisma.$transaction(async (tx) => {
        const whereCart = field === 'user_id' ? { user_id: parseInt(value) } : { session_id: value };
        const cartItems = await tx.cart_items.findMany({
            where: whereCart,
            include: { products: true }
        });

        if (cartItems.length === 0) throw new Error('CART_EMPTY');

        for (const item of cartItems) {
            if (item.products.stock < item.quantity) {
                throw new Error(`INSUFFICIENT_STOCK_${item.products.name}`);
            }
        }

        const total = cartItems.reduce((sum, item) => sum + parseFloat(item.products.price) * item.quantity, 0);

        const newOrder = await tx.orders.create({
            data: {
                user_id: field === 'user_id' ? parseInt(value) : null,
                session_id: field === 'session_id' ? value : null,
                total_amount: total,
                status: 'placed',
                address_json: address
            }
        });

        for (const item of cartItems) {
            await tx.order_items.create({
                data: {
                    order_id: newOrder.id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unit_price: item.products.price
                }
            });
            await tx.products.update({
                where: { id: item.product_id },
                data: { stock: { decrement: item.quantity } }
            });
        }

        await tx.cart_items.deleteMany({ where: whereCart });

        return { orderId: newOrder.id, cartItems, total };
    }, { timeout: 15000 });

    const fakeItems = transaction.cartItems.map(c => ({ product_name: c.products.name, quantity: c.quantity }));
    await sendOrderEmail({ id: transaction.orderId, total_amount: transaction.total }, fakeItems, address);

    res.status(201).json({ message: 'Order placed successfully', orderId: transaction.orderId });
  } catch (err) {
    if (err.message === 'CART_EMPTY') return res.status(400).json({ error: 'Cart is empty' });
    if (err.message.startsWith('INSUFFICIENT_STOCK_')) return res.status(400).json({ error: err.message.replace('INSUFFICIENT_STOCK_', 'Insufficient stock for ') });
    
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  placeOrder
};
