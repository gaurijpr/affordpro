import { Router } from 'express';
import {
  getProductReviews,
  getFeaturedReviews,
  addReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';

const router = Router();

router.get('/', getFeaturedReviews);
router.get('/featured', getFeaturedReviews);
router.get('/:productId/reviews', getProductReviews);
router.post('/:productId/reviews', addReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

export default router;
