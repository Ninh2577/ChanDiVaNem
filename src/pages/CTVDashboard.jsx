import React, { useState } from 'react';
import { Plus, Edit, Eye, Send, FileText, CheckCircle, Clock } from 'lucide-react';
import '../pages/AdminTable.css';
import '../pages/AdminDashboard.css';

const MY_POSTS = [
  { id: 1, title: 'Hương vị cà phê trứng Hà Nội: Ngọt đắng đan xen', category: 'Ẩm Thực', status: 'pending', date: '2024-05-24', views: 0 },
  { id: 2, title: 'Nét đẹp làng bích họa Tam Thanh', category: 'Điểm Đến', status: 'published', date: '2024-05-10', views: 1250 },
  { id: 3, title: 'Bánh xèo miền Trung khác miền Tây thế nào?', category: 'Ẩm Thực', status: 'published', date: '2024-04-20', views: 3400 },
  { id: 4, title: 'Ký sự chợ nổi Cái Răng', category: 'Văn Hóa', status: 'draft', date: '2024-05-27', views: 0 },
];

const CTVDashboard = () => {
  const [posts, setPosts] = useState(MY_POSTS);

  const handleSendApproval = (id) => {
    if(window.confirm('Bạn có chắc chắn muốn gửi bài viết này cho Ban biên tập duyệt?')) {
      setPosts(posts.map(p => p.id === id ? { ...p, status: 'pending' } : p));
      alert('Đã gửi phê duyệt thành công!');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Tổng Quan</h1>
          <p>Xin chào, đây là không gian sáng tạo của bạn.</p>
        </div>
        <button className="btn-primary" style={{ backgroundColor: '#10b981' }}>
          <Plus size={18} /> Viết bài mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: '1rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#d1fae5' }}>
            <FileText size={24} color="#059669" />
          </div>
          <div className="stat-info">
            <span className="stat-value">4</span>
            <span className="stat-label">Tổng bài viết</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7' }}>
            <Clock size={24} color="#d97706" />
          </div>
          <div className="stat-info">
            <span className="stat-value">1</span>
            <span className="stat-label">Đang chờ duyệt</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e0f2fe' }}>
            <CheckCircle size={24} color="#0284c7" />
          </div>
          <div className="stat-info">
            <span className="stat-value">2</span>
            <span className="stat-label">Đã xuất bản</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fee2e2' }}>
            <Eye size={24} color="#dc2626" />
          </div>
          <div className="stat-info">
            <span className="stat-value">4,650</span>
            <span className="stat-label">Lượt đọc bài của bạn</span>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Bài Viết Gần Đây</h3>
        </div>

        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Chuyên mục</th>
                <th>Trạng thái</th>
                <th>Lượt xem</th>
                <th>Ngày tạo</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id}>
                  <td className="font-medium">{post.title}</td>
                  <td><span className="category-badge">{post.category}</span></td>
                  <td>
                    {post.status === 'published' && <span className="status-badge success">Đã xuất bản</span>}
                    {post.status === 'pending' && <span className="status-badge warning">Chờ duyệt</span>}
                    {post.status === 'draft' && <span className="status-badge" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>Bản nháp</span>}
                  </td>
                  <td>{post.views > 0 ? post.views.toLocaleString() : '-'}</td>
                  <td>{post.date}</td>
                  <td className="text-right actions-cell">
                    {post.status === 'draft' && (
                      <button className="action-btn-text" style={{ borderColor: '#10b981', color: '#10b981' }} onClick={() => handleSendApproval(post.id)}>
                        <Send size={16} /> Gửi duyệt
                      </button>
                    )}
                    <button className="action-icon primary" title="Chỉnh sửa"><Edit size={18} /></button>
                    {post.status === 'published' && (
                      <button className="action-icon" style={{ color: '#64748b' }} title="Xem bài viết"><Eye size={18} /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CTVDashboard;
