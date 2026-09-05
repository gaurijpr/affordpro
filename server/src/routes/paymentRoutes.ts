import { Router } from 'express';
import { createPaymentSession, verifyPayment, handleWebhook } from '../controllers/paymentController.js';

const router = Router();

router.post('/create-order', createPaymentSession);
router.post('/create', createPaymentSession);
router.post('/verify', verifyPayment);
router.post('/webhook', handleWebhook);

export default router;
