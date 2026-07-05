import express from 'express';
import {
  getNavigation, updateNavigation, addRootItem,
  addChild, updateItem, deleteItem, reorderItems
} from '../controllers/navigationController.js';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Công khai
router.get('/', getNavigation);

// Admin only
router.put('/', verifyAdmin, updateNavigation);
router.post('/root', verifyAdmin, addRootItem);
router.post('/reorder', verifyAdmin, reorderItems);
router.post('/:parentId/children', verifyAdmin, addChild);
router.patch('/:id', verifyAdmin, updateItem);
router.delete('/:id', verifyAdmin, deleteItem);

export default router;
