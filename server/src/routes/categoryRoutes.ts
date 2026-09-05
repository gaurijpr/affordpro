import { Router } from 'express';
import { getCategories, getCategoryBySlug } from '../controllers/categoryController.js';
import { createAdminCategory, updateAdminCategory, deleteAdminCategory } from '../controllers/adminController.js';

const router = Router();

router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

// Admin Category Mutations
router.post('/', createAdminCategory);
router.put('/:id', updateAdminCategory);
router.patch('/:id', updateAdminCategory);
router.delete('/:id', deleteAdminCategory);

export default router;
