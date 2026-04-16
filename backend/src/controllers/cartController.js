const prisma = require('../db/prisma');
const { getIdentifier } = require('../utils/helpers');

const getCart = async (req, res) => {
  const { field, value } = getIdentifier(req);
  try {
    const whereClause = field === 'user_id' ? { user_id: value } : { session_id: value };
    const cartItems = await prisma.cart_items.findMany({
      where: whereClause,
      include: {
        products: {
          include: {
            product_images: {
              where: { is_primary: true },
              take: 1
            }
          }
        }
      }
    });

    const items = cartItems.map(c => {
        const p = c.products;
        return {
            id: c.id,
            quantity: c.quantity,
            product_id: p.id,
            name: p.name,
            price: p.price,
            mrp: p.mrp,
            stock: p.stock,
            brand: p.brand,
            image: p.product_images?.[0]?.url || null
        }
    });

    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const addToCart = async (req, res) => {
  const { product_id, quantity = 1 } = req.body;
  const { field, value } = getIdentifier(req);
  if (!product_id) return res.status(400).json({ error: 'product_id required' });

  try {
    const product = await prisma.products.findUnique({
      where: { id: parseInt(product_id) },
      select: { stock: true }
    });

    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.stock < quantity) return res.status(400).json({ error: 'Insufficient stock' });

    const qtyNumber = parseInt(quantity);
    const prodIdNum = parseInt(product_id);

    if (field === 'user_id') {
      await prisma.cart_items.upsert({
        where: { user_id_product_id: { user_id: value, product_id: prodIdNum } },
        update: { quantity: { increment: qtyNumber } },
        create: { user_id: value, product_id: prodIdNum, quantity: qtyNumber }
      });
    } else {
      const existing = await prisma.cart_items.findFirst({
        where: { session_id: value, product_id: prodIdNum }
      });
      if (existing) {
        await prisma.cart_items.update({
          where: { id: existing.id },
          data: { quantity: { increment: qtyNumber } }
        });
      } else {
        await prisma.cart_items.create({
          data: { session_id: value, product_id: prodIdNum, quantity: qtyNumber }
        });
      }
    }
    res.status(201).json({ message: 'Added to cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const { id } = req.params;
  if (!quantity || quantity < 1) return res.status(400).json({ error: 'Valid quantity required' });
  try {
    await prisma.cart_items.update({
      where: { id: parseInt(id) },
      data: { quantity: parseInt(quantity) }
    });
    res.json({ message: 'Cart updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const removeCartItem = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.cart_items.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const clearCart = async (req, res) => {
  const { field, value } = getIdentifier(req);
  try {
    const filter = field === 'user_id' ? { user_id: value } : { session_id: value };
    await prisma.cart_items.deleteMany({
      where: filter
    });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};
