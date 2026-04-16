require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const wishlistRoutes = require('./routes/wishlist');

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production';
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Rejected origin: ${origin}`);
      // Returning error with status to differentiate from internal server errors
      const corsError = new Error('Not allowed by CORS');
      corsError.status = 403;
      callback(corsError);
    }
  },
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const isProd = process.env.NODE_ENV === 'production';
  
  if (status === 500) {
    console.error('💥 Internal Server Error:', err.stack);
  } else {
    console.warn(`⚠️  ${status} Error: ${err.message}`);
  }
  
  res.status(status).json({
    error: err.message || 'Internal Server Error',
    // Include stack trace only in development
    ...(!isProd && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
// Always listen unless on Vercel serverless (which uses the exported app)
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;
