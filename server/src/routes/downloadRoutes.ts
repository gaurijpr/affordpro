import { Router } from 'express';
import { downloadProduct } from '../controllers/downloadController.js';
import { authenticateJwt } from '../middleware/auth.js';

const router = Router();

router.get('/:orderId/:productId', authenticateJwt, downloadProduct);

export default router;
