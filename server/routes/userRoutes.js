import express from 'express';
import { getUsers, deleteUser } from '../controllers/userController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyAdmin, getUsers);
router.delete('/:id', verifyAdmin, deleteUser);

export default router;
