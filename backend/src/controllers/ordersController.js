const prisma = require('../db/prisma');
const { getIdentifier } = require('../utils/helpers');
const nodemailer = require('nodemailer');

async function sendOrderEmail(order, items, address) {
  try {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM_EMAIL } = process.env;
    
    // 1. Validate Credentials
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      console.warn('⚠️  [Email Skip]: SMTP credentials missing from environment variables (SMTP_HOST, SMTP_USER, or SMTP_PASS).');
      return;
    }

    // 2. Validate Recipient
    if (!address.email || !address.email.includes('@')) {
      console.warn(`⚠️  [Email Skip]: Invalid or missing recipient email address: "${address.email}". Skipping notification for Order #${order.id}.`);
      return;
    }

    console.log(`📧 [Email Start]: Preparing order confirmation for Order #${order.id} to ${address.email}...`);

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT) || 587,
      secure: parseInt(SMTP_PORT) === 465, 
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
      tls: {
        // Do not fail on invalid certs (common for some hosting environments)
        rejectUnauthorized: false
      }
    });

    const itemsHtml = items.map(
      (i) => `<li style="margin-bottom: 8px;">${i.quantity}x <strong style="color: #212121;">${i.product_name}</strong></li>`
    ).join('');

    const mailOptions = {
      from: SMTP_FROM_EMAIL || `"Flipkart Clone Support" <${SMTP_USER}>`,
      to: address.email,
      subject: `Order Recieved! - Order #${order.id} is confirmed`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eeeeee; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
          <div style="background-color: #2874f0; padding: 25px; color: white; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Order Confirmed! 🎉</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for shopping with Flipkart Clone</p>
          </div>
          <div style="padding: 24px;">
            <p style="font-size: 16px; color: #333;">Hi <strong>${address.full_name}</strong>,</p>
            <p style="color: #555; line-height: 1.5;">Great news! We've received your order <strong>#${order.id}</strong> and are getting it ready for shipment.</p>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 15px 0; font-size: 14px; text-transform: uppercase; color: #878787; letter-spacing: 0.5px;">Items Ordered</h3>
              <ul style="margin: 0; padding-left: 20px; color: #212121;">
                ${itemsHtml}
              </ul>
              <div style="margin-top: 15px; border-top: 1px solid #e0e0e0; pt: 10px; display: flex; justify-content: space-between; font-weight: bold;">
                <span style="color: #878787;">Total Amount Paid:</span>
                <span style="color: #2874f0;">₹${parseFloat(order.total_amount).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style="padding: 20px; border: 1px solid #eeeeee; border-radius: 8px;">
              <h3 style="margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; color: #878787;">Shipping to</h3>
              <p style="margin: 0; color: #212121; line-height: 1.6; font-size: 14px;">
                <strong>${address.full_name}</strong><br/>
                ${address.address_line1}, ${address.address_line2 ? address.address_line2 + ', ' : ''}<br/>
                ${address.city}, ${address.state} - ${address.pincode}<br/>
                <span style="color: #878787;">Phone: ${address.phone}</span>
              </p>
            </div>
          </div>
          <div style="background-color: #f1f3f6; color: #878787; text-align: center; padding: 20px; font-size: 11px;">
            <p style="margin: 0;">This is an automated delivery confirmation. For any queries, reach out to our support team.</p>
            <p style="margin: 5px 0 0 0;">Flipkart Clone Inc. | Online Retail Portal</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [Email Success]: Order confirmation email sent to ${address.email} (MessageId: ${info.messageId})`);
  } catch (error) {
    console.error(`❌ [Email Error]: Failed to send confirmation email for Order #${order.id}:`, error.message);
    if (error.code === 'EAUTH') {
      console.error('👉 Tip: Check your SMTP_USER and SMTP_PASS. If using Gmail, make sure you created an "App Password".');
    }
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

    const orderItems = transaction.cartItems.map(c => ({ product_name: c.products.name, quantity: c.quantity }));
    
    // Fallback: If no email in address form, try to use user's registered email
    let targetEmail = address.email;
    if (!targetEmail && field === 'user_id') {
      const user = await prisma.users.findUnique({ where: { id: parseInt(value) }, select: { email: true } });
      if (user) targetEmail = user.email;
    }

    await sendOrderEmail(
        { id: transaction.orderId, total_amount: transaction.total }, 
        orderItems, 
        { ...address, email: targetEmail }
    );

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
