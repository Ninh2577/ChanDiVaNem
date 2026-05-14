import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import './AdminTable.css';

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bài viết:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTimer = window.setTimeout(() => {
      void fetchPosts();
    }, 0);
    return () => window.clearTimeout(fetchTimer);
  }, []);

  const handleTogglePublish = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/posts/${id}/toggle-lock`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        fetchPosts(); // Cập nhật lại danh sách sau khi đổi trạng thái
      } else {
        alert('Có lỗi xảy ra hoặc bạn không có quyền thực hiện.');
      }
    } catch (error) {
      console.error('Lỗi duyệt bài:', error);
      alert('Lỗi kết nối máy chủ!');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Bạn có chắc chắn muốn xóa bài viết này vĩnh viễn?')) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          fetchPosts();
        } else {
          alert('Lỗi xóa bài viết.');
        }
      } catch (error) {
        console.error('Lỗi xóa bài:', error);
        alert('Lỗi kết nối máy chủ!');
      }
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Quản Lý Bài Viết</h1>
          <p>Duyệt bài của Cộng tác viên, quản lý và xuất bản nội dung.</p>
        </div>
        <Link to="/admin/posts/create" className="btn-primary">
          + Viết bài mới
        </Link>
      </div>

      <div className="admin-card">
        <div className="table-toolbar">
          <div className="tabs">
            <button className="tab-btn active">Tất cả</button>
            <button className="tab-btn">Đã xuất bản</button>
            <button className="tab-btn">Chờ duyệt</button>
          </div>
          
          <div className="toolbar-actions">
            <div className="search-box">
              <Search size={16} />
              <input type="text" placeholder="Tìm kiếm bài viết..." />
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Tác giả</th>
                <th>Chuyên mục</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-8">Đang tải bài viết...</td></tr>
              ) : posts.length === 0 ? (
                <tr><td colSpan="6" className="text-center empty-state">Chưa có bài viết nào.</td></tr>
              ) : (
                posts.map(post => (
                  <tr key={post.id}>
                    <td className="font-medium max-w-xs truncate" title={post.title}>
                      {post.title}
                    </td>
                    <td>{post.author}</td>
                    <td><span className="category-tag">{post.category}</span></td>
                    <td>
                      {post.status === 'published' 
                        ? <span className="status-badge success">Đã xuất bản</span>
                        : <span className="status-badge warning">Chờ duyệt</span>
                      }
                    </td>
                    <td>{post.date}</td>
                    <td className="text-right actions-cell">
                      {post.status === 'pending' ? (
                        <button className="action-icon success" title="Duyệt bài" onClick={() => handleTogglePublish(post.id)}>
                          <CheckCircle size={18} />
                        </button>
                      ) : (
                        <button className="action-icon danger" title="Gỡ bài" onClick={() => handleTogglePublish(post.id)}>
                          <XCircle size={18} />
                        </button>
                      )}
                      <Link to={`/admin/posts/edit/${post.id}`} className="action-icon" title="Chỉnh sửa"><Edit size={18} /></Link>
                      <button className="action-icon danger" title="Xóa" onClick={() => handleDelete(post.id)}><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPosts;
