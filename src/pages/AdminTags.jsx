import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2 } from 'lucide-react';
import { fetchWithAuth } from '../utils/api';
import './AdminTags.css';

const AdminTags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // States cho Form Thêm/Sửa
  const [tagName, setTagName] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/tags');
      if (res.ok) {
        setTags(await res.json());
      }
    } catch (error) {
      console.error('Lỗi tải danh sách thẻ:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tagName.trim()) return;

    try {
      const url = editingId 
        ? `http://localhost:5000/api/tags/${editingId}`
        : 'http://localhost:5000/api/tags';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetchWithAuth(url, {
        method,
        body: JSON.stringify({ name: tagName.trim() })
      });

      if (res.ok) {
        alert(editingId ? 'Cập nhật thẻ thành công!' : 'Tạo thẻ mới thành công!');
        setTagName('');
        setEditingId(null);
        fetchTags();
      } else {
        const err = await res.json();
        alert(err.message || 'Thao tác thất bại.');
      }
    } catch (error) {
      console.error('Lỗi lưu thẻ:', error);
      alert('Lỗi kết nối máy chủ!');
    }
  };

  const handleEditClick = (tag) => {
    setEditingId(tag.id);
    setTagName(tag.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTagName('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thẻ này vĩnh viễn?')) {
      try {
        const res = await fetchWithAuth(`http://localhost:5000/api/tags/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          fetchTags();
        } else {
          const err = await res.json();
          alert(err.message || 'Lỗi khi xóa thẻ.');
        }
      } catch (error) {
        console.error('Lỗi xóa thẻ:', error);
        alert('Lỗi kết nối máy chủ!');
      }
    }
  };

  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tag.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Quản Lý Thẻ (Tags)</h1>
          <p>Quản lý các thẻ từ khóa, nhãn phân loại bài viết ẩm thực.</p>
        </div>
      </div>

      <div className="tags-grid">
        {/* Cột trái: Danh sách thẻ */}
        <div className="admin-card tags-list-card">
          <div className="table-toolbar">
            <div className="search-box">
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Tìm kiếm thẻ..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tên thẻ</th>
                  <th>Đường dẫn (Slug)</th>
                  <th className="text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="3" className="text-center py-8">Đang tải thẻ...</td></tr>
                ) : filteredTags.length === 0 ? (
                  <tr><td colSpan="3" className="text-center empty-state">Chưa có thẻ nào phù hợp.</td></tr>
                ) : (
                  filteredTags.map(tag => (
                    <tr key={tag.id}>
                      <td className="font-medium">{tag.name}</td>
                      <td><code>{tag.slug}</code></td>
                      <td className="text-right actions-cell">
                        <button className="action-icon" title="Chỉnh sửa" onClick={() => handleEditClick(tag)}>
                          <Edit size={18} />
                        </button>
                        <button className="action-icon danger" title="Xóa" onClick={() => handleDelete(tag.id)}>
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cột phải: Form Thêm/Sửa thẻ */}
        <div className="admin-card tag-form-card">
          <h2>{editingId ? 'Chỉnh Sửa Thẻ' : 'Thêm Thẻ Mới'}</h2>
          <form onSubmit={handleSubmit} className="tag-form">
            <div className="form-group">
              <label htmlFor="tagName">Tên thẻ:</label>
              <input 
                type="text" 
                id="tagName"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder="Ví dụ: Bún chả, Review..."
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? 'Cập nhật' : 'Tạo mới'}
              </button>
              {editingId && (
                <button type="button" className="btn-secondary" onClick={handleCancelEdit}>
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminTags;
