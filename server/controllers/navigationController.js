import * as nav from '../services/navigationService.js';

// GET /api/navigation — Công khai, trả cây đầy đủ
export const getNavigation = async (req, res) => {
  try {
    const tree = await nav.getNavigation();
    res.json(tree);
  } catch {
    res.status(500).json({ message: 'Lỗi lấy menu.' });
  }
};

// PUT /api/navigation — Lưu toàn bộ (Admin)
export const updateNavigation = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ message: 'Dữ liệu không hợp lệ.' });
    const updated = await nav.updateNavigation(items);
    res.json({ message: 'Cập nhật menu thành công!', items: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi cập nhật menu.' });
  }
};

// POST /api/navigation/root — Thêm mục gốc (Admin)
export const addRootItem = async (req, res) => {
  try {
    const { label, path, icon } = req.body;
    if (!label || !path) return res.status(400).json({ message: 'Cần có tên và đường dẫn.' });
    const item = await nav.addRootItem({ label, path, icon });
    res.status(201).json(item);
  } catch {
    res.status(500).json({ message: 'Lỗi thêm mục menu.' });
  }
};

// POST /api/navigation/:parentId/children — Thêm mục con (Admin)
export const addChild = async (req, res) => {
  try {
    const { label, path, icon, imageUrl, description } = req.body;
    if (!label || !path) return res.status(400).json({ message: 'Cần có tên và đường dẫn.' });
    const item = await nav.addNavigationChild({ label, path, parentId: req.params.parentId, icon, imageUrl, description });
    res.status(201).json(item);
  } catch {
    res.status(500).json({ message: 'Lỗi thêm mục con.' });
  }
};

// PATCH /api/navigation/:id — Cập nhật 1 mục (Admin)
export const updateItem = async (req, res) => {
  try {
    const item = await nav.updateItem(req.params.id, req.body);
    res.json(item);
  } catch {
    res.status(500).json({ message: 'Lỗi cập nhật mục menu.' });
  }
};

// DELETE /api/navigation/:id — Xóa mục và con (Admin)
export const deleteItem = async (req, res) => {
  try {
    await nav.deleteItem(req.params.id);
    res.json({ message: 'Đã xóa mục menu.' });
  } catch {
    res.status(500).json({ message: 'Lỗi xóa mục menu.' });
  }
};

// POST /api/navigation/reorder — Cập nhật thứ tự cùng cấp (Admin)
export const reorderItems = async (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) return res.status(400).json({ message: 'Dữ liệu không hợp lệ.' });
    await nav.reorderItems(orderedIds);
    res.json({ message: 'Cập nhật thứ tự thành công!' });
  } catch {
    res.status(500).json({ message: 'Lỗi cập nhật thứ tự.' });
  }
};
