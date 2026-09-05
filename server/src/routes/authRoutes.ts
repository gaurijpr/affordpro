import { Router } from 'express';
import { register, login, getMe, forgotPassword, updateProfile } from '../controllers/authController.js';
import { authenticateJwt } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/me', authenticateJwt, getMe);
router.put('/user/profile', updateProfile);

export default router;
