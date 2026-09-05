import { Router } from 'express';
import { createOrder, getOrderById, getUserOrders } from '../controllers/orderController.js';
import { authenticateJwt } from '../middleware/auth.js';

const router = Router();

router.post('/', createOrder);
router.get('/user/orders', authenticateJwt, getUserOrders);
router.get('/:id', getOrderById);

export default router;
