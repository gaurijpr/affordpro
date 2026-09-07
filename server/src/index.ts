import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import downloadRoutes from './routes/downloadRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:3000')
        .split(',')
        .map((s) => s.trim());

      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed for this origin'));
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));

// API Root Index Handler (http://localhost:5000/ and http://localhost:5000/api/v1)
const rootHandler = (_req: express.Request, res: express.Response) => {
  res.json({
    success: true,
    message: 'Welcome to AffordPro Digital Marketplace API Server',
    version: '1.0.0',
    status: 'ONLINE',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/v1/health',
      products: '/api/v1/products',
      featuredProducts: '/api/v1/products/featured',
      categories: '/api/v1/categories',
      auth: '/api/v1/auth',
      orders: '/api/v1/orders',
      couponValidate: '/api/v1/coupons/validate?code=WELCOME50&total=499',
      admin: '/api/v1/admin/dashboard',
    },
  });
};

app.get('/', rootHandler);
app.get('/api/v1', rootHandler);

// Health Check Endpoint
app.get('/api/v1/health', (_req, res) => {
  res.json({
    success: true,
    message: 'AffordPro API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount Modular API Routes
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/downloads', downloadRoutes);
app.use('/api/v1/admin', adminRoutes);

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled API Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 AffordPro Backend API Server running at http://localhost:${PORT}`);
  console.log(`📋 Health Check: http://localhost:${PORT}/api/v1/health`);
});
