import express from 'express';
import { getAllContent, getContent, updateContent } from '../controllers/siteContentController.js';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllContent);
router.get('/:key', getContent);
router.put('/:key', verifyToken, verifyAdmin, updateContent);

export default router;
