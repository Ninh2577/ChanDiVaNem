import express from 'express';
import { submitApplication, getApplications, updateApplicationStatus } from '../controllers/applicationController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Gửi đơn ứng tuyển (Công khai)
router.post('/', submitApplication);

// Lấy danh sách đơn (Admin)
router.get('/', verifyAdmin, getApplications);

// Cập nhật trạng thái duyệt đơn (Admin)
router.patch('/:id/status', verifyAdmin, updateApplicationStatus);

export default router;
