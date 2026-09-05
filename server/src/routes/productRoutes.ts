import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
  getBestSellers,
  getNewArrivals,
  getRelatedProducts,
} from '../controllers/productController.js';

const router = Router();

router.get('/featured', getFeaturedProducts);
router.get('/best-selling', getBestSellers);
router.get('/new', getNewArrivals);
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.get('/:slug/related', getRelatedProducts);

export default router;
