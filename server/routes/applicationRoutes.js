import express from 'express';
import { submitApplication, getApplications, updateApplicationStatus } from '../controllers/applicationController.js';

const router = express.Router();

// Gửi đơn ứng tuyển (Công khai)
router.post('/', submitApplication);

// Lấy danh sách đơn (Admin)
router.get('/', getApplications);

// Cập nhật trạng thái duyệt đơn (Admin)
router.patch('/:id/status', updateApplicationStatus);

export default router;
