import { Router } from 'express';
import {
  getAdminDashboard,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  getAdminOrders,
  updateAdminOrderStatus,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from '../controllers/adminController.js';
import { authenticateJwt, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Middleware: Verify JWT and ensure user role is ADMIN
router.use(authenticateJwt, requireAdmin);

router.get('/dashboard', getAdminDashboard);
router.get('/products', createAdminProduct);
router.post('/products', createAdminProduct);
router.put('/products/:id', updateAdminProduct);
router.patch('/products/:id', updateAdminProduct);
router.delete('/products/:id', deleteAdminProduct);

router.post('/categories', createAdminCategory);
router.put('/categories/:id', updateAdminCategory);
router.patch('/categories/:id', updateAdminCategory);
router.delete('/categories/:id', deleteAdminCategory);

router.get('/orders', getAdminOrders);
router.patch('/orders/:id/status', updateAdminOrderStatus);

export default router;
