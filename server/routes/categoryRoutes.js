import express from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { createCategorySchema, updateCategorySchema } from '../validators/categoryValidator.js';

const router = express.Router();

router.get('/', getCategories);

// Các route quản lý (chỉ dành cho Admin)
router.post('/', verifyAdmin, validate(createCategorySchema), createCategory);
router.put('/:id', verifyAdmin, validate(updateCategorySchema), updateCategory);
router.delete('/:id', verifyAdmin, deleteCategory);

export default router;
