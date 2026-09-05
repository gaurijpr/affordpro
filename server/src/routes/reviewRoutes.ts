import { Router } from 'express';
import { getProductReviews, addReview } from '../controllers/reviewController.js';

const router = Router();

router.get('/:productId/reviews', getProductReviews);
router.post('/:productId/reviews', addReview);

export default router;
