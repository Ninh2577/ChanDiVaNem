import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Folder, ChevronRight, Save, X } from 'lucide-react';
import { fetchWithAuth } from '../utils/api';
import './AdminCategories.css';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', parentId: '' });

  const token = localStorage.getItem('token');

  const fetchCategories = async () => {
    try {
      const res = await fetchWithAuth('http://localhost:5000/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Lỗi lấy danh mục:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTimer = window.setTimeout(() => {
      void fetchCategories();
    }, 0);
    return () => window.clearTimeout(fetchTimer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from name if adding
    if (name === 'name' && !editingId) {
      const slug = value.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '', parentId: '' });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      parentId: cat.parentId || ''
    });
    setIsAdding(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId 
      ? `http://localhost:5000/api/categories/${editingId}`
      : 'http://localhost:5000/api/categories';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetchWithAuth(url, {
        method,
        body: JSON.stringify({
          ...formData,
          parentId: formData.parentId ? parseInt(formData.parentId) : null
        })
      });

      if (res.ok) {
        fetchCategories();
        resetForm();
      } else {
        const error = await res.json();
        alert(error.message || 'Có lỗi xảy ra');
      }
    } catch {
      alert('Lỗi kết nối máy chủ');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa chuyên mục này? Các bài viết thuộc chuyên mục này có thể bị ảnh hưởng.')) return;

    try {
      const res = await fetchWithAuth(`http://localhost:5000/api/categories/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        fetchCategories();
      }
    } catch {
      alert('Lỗi khi xóa chuyên mục');
    }
  };

  if (loading) return <div className="admin-page"><p>Đang tải...</p></div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Quản Lý Chuyên Mục</h1>
          <p>Tổ chức cấu hình các chuyên mục bài viết theo phân cấp (Cha - Con).</p>
        </div>
        <button className="btn-primary" onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus size={18} /> Thêm chuyên mục
        </button>
      </div>

      <div className="category-layout">
        {/* Form Section */}
        {isAdding && (
          <div className="admin-card category-form-card">
            <div className="admin-card-header">
              <h3>{editingId ? 'Chỉnh Sửa Chuyên Mục' : 'Thêm Chuyên Mục Mới'}</h3>
            </div>
            <div className="admin-card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group-p">
                  <label>Tên chuyên mục *</label>
                  <input 
                    type="text" 
                    name="name"
                    className="editor-input" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group-p mt-3">
                  <label>Đường dẫn (Slug) *</label>
                  <input 
                    type="text" 
                    name="slug"
                    className="editor-input" 
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group-p mt-3">
                  <label>Chuyên mục cha (Tùy chọn)</label>
                  <select 
                    name="parentId"
                    className="editor-select"
                    value={formData.parentId}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Cấp cao nhất --</option>
                    {categories.filter(c => !c.parentId && c.id !== editingId).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group-p mt-3">
                  <label>Mô tả</label>
                  <textarea 
                    name="description"
                    className="editor-input"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                  ></textarea>
                </div>
                <div className="form-actions mt-4">
                  <button type="submit" className="btn-primary"><Save size={16} /> Lưu</button>
                  <button type="button" className="btn-outline" onClick={resetForm}><X size={16} /> Hủy</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* List Section */}
        <div className="admin-card category-list-card">
          <div className="admin-card-header">
            <h3>Danh Sách Chuyên Mục</h3>
          </div>
          <div className="admin-card-body p-0">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tên chuyên mục</th>
                  <th>Slug</th>
                  <th>Mô tả</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {categories.filter(c => !c.parentId).map(parent => (
                  <React.Fragment key={parent.id}>
                    <tr>
                      <td className="parent-cat">
                        <Folder size={18} className="cat-icon" />
                        <strong>{parent.name}</strong>
                      </td>
                      <td><code>{parent.slug}</code></td>
                      <td className="cat-desc">{parent.description || '-'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="action-btn-p" onClick={() => handleEdit(parent)} title="Sửa"><Edit2 size={16} /></button>
                        <button className="action-btn-p delete" onClick={() => handleDelete(parent.id)} title="Xóa"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                    {categories.filter(child => child.parentId === parent.id).map(child => (
                      <tr key={child.id}>
                        <td className="child-cat">
                          <ChevronRight size={16} className="cat-arrow" />
                          {child.name}
                        </td>
                        <td><code>{child.slug}</code></td>
                        <td className="cat-desc">{child.description || '-'}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button className="action-btn-p" onClick={() => handleEdit(child)} title="Sửa"><Edit2 size={16} /></button>
                          <button className="action-btn-p delete" onClick={() => handleDelete(child.id)} title="Xóa"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
