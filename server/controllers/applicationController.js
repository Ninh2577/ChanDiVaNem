import catchAsync from '../utils/catchAsync.js';
import * as applicationService from '../services/applicationService.js';

export const submitApplication = catchAsync(async (req, res) => {
  const application = await applicationService.submitApplication(req.body);
  res.status(201).json({ message: 'Đã gửi đơn ứng tuyển thành công', application });
});

export const getApplications = catchAsync(async (req, res) => {
  const { page, limit, status } = req.query;
  const result = await applicationService.getApplications({ page, limit, status });
  res.json(result);
});

export const updateApplicationStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const updatedApp = await applicationService.updateApplicationStatus(id, status);
  res.json({ message: 'Đã cập nhật trạng thái đơn', application: updatedApp });
});
