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
router.put('/', verifyToken, verifyAdmin, updateNavigation);
router.post('/root', verifyToken, verifyAdmin, addRootItem);
router.post('/reorder', verifyToken, verifyAdmin, reorderItems);
router.post('/:parentId/children', verifyToken, verifyAdmin, addChild);
router.patch('/:id', verifyToken, verifyAdmin, updateItem);
router.delete('/:id', verifyToken, verifyAdmin, deleteItem);

export default router;
