import * as svc from '../services/siteContentService.js';

// GET /api/site-content — Lấy tất cả (public)
export const getAllContent = async (req, res) => {
  try {
    const data = await svc.getAllContent();
    res.json(data);
  } catch {
    res.status(500).json({ message: 'Lỗi server.' });
  }
};

// GET /api/site-content/:key — Lấy 1 section (public)
export const getContent = async (req, res) => {
  try {
    const data = await svc.getContent(req.params.key);
    if (!data) return res.status(404).json({ message: 'Không tìm thấy.' });
    res.json(data);
  } catch {
    res.status(500).json({ message: 'Lỗi server.' });
  }
};

// PUT /api/site-content/:key — Cập nhật 1 section (Admin)
export const updateContent = async (req, res) => {
  try {
    const { key } = req.params;
    await svc.upsertContent(key, req.body);
    res.json({ message: 'Cập nhật thành công!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi cập nhật.' });
  }
};
