import express from 'express';
import { getTags, createTag, updateTag, deleteTag } from '../controllers/tagController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { createTagSchema } from '../validators/tagValidator.js';

const router = express.Router();

// Công khai (Public)
router.get('/', getTags);

// Quản trị (Admin only)
router.post('/', verifyAdmin, validate(createTagSchema), createTag);
router.put('/:id', verifyAdmin, validate(createTagSchema), updateTag);
router.delete('/:id', verifyAdmin, deleteTag);

export default router;
