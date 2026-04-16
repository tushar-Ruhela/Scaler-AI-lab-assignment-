const prisma = require('../db/prisma');

const getProductCategories = async (req, res) => {
  try {
    const categories = await prisma.categories.findMany({ orderBy: { name: 'asc' } });
    res.json({ categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getProducts = async (req, res) => {
  const { search, category, page = 1, limit = 20, sort = 'created_at', order = 'desc' } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  let conditions = ['p.is_active = TRUE'];
  let params = [];
  let paramCount = 1;

  if (search) {
    const terms = search.trim().split(/\s+/).filter(Boolean);
    if (terms.length > 0) {
      const termConditions = terms.map(term => {
        const condition = `(p.name ILIKE $${paramCount} OR p.brand ILIKE $${paramCount})`;
        params.push(`%${term}%`);
        paramCount++;
        return condition;
      });
      conditions.push(`(${termConditions.join(' AND ')})`);
    }
  }

  if (category) {
    conditions.push(`c.slug = $${paramCount}`);
    params.push(category);
    paramCount++;
  }

  const whereClause = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

  const validSorts = { price: 'p.price', rating: 'p.rating', created_at: 'p.created_at', name: 'p.name' };
  const sortCol = validSorts[sort] || 'p.created_at';
  const sortOrder = order === 'asc' ? 'ASC' : 'DESC';

  try {
    const countResult = await prisma.$queryRawUnsafe(
      `SELECT COUNT(*) FROM products p LEFT JOIN categories c ON p.category_id = c.id ${whereClause}`,
      ...params
    );
    const total = Number(countResult[0].count);

    const products = await prisma.$queryRawUnsafe(
      `SELECT p.id, p.name, p.slug, p.price, p.mrp, p.stock, p.rating, p.rating_count, p.brand,
              c.name AS category_name, c.slug AS category_slug,
              (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) AS primary_image
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ${whereClause}
       ORDER BY ${sortCol} ${sortOrder}
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      ...params, parseInt(limit), offset
    );

    res.json({
      products: products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.products.findUnique({
      where: { id: parseInt(id) },
      include: {
        categories: true,
        product_images: { orderBy: { display_order: 'asc' }, select: { url: true } },
        product_specs: true
      }
    });

    if (!product || !product.is_active) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      product: {
        ...product,
        category_name: product.categories?.name,
        category_slug: product.categories?.slug,
        images: product.product_images.map(i => i.url),
        specs: product.product_specs.map(s => ({ spec_key: s.spec_key, spec_value: s.spec_value }))
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getProductCategories,
  getProducts,
  getProductById
};
