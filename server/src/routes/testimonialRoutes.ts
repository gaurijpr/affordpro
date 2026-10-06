import { Router } from 'express';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  deleteAllTestimonials,
} from '../controllers/testimonialController.js';

const router = Router();

router.get('/', getTestimonials);
router.post('/', createTestimonial);
router.delete('/', deleteAllTestimonials);
router.put('/:id', updateTestimonial);
router.delete('/:id', deleteTestimonial);

export default router;
