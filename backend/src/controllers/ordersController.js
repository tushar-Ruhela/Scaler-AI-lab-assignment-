const prisma = require('../db/prisma');
const { getIdentifier } = require('../utils/helpers');

// Placeholder: integrate a real email provider (e.g. nodemailer, SendGrid) here
async function sendOrderEmail(order, items, address) {
  // TODO: send actual confirmation email to address.email
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
