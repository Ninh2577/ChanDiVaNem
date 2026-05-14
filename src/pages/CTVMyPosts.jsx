import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Edit, Eye, Send, Filter, Plus, Trash2 } from 'lucide-react';
import '../pages/AdminTable.css'; // Reusing table styles

const INITIAL_POSTS = [
  { id: 1, title: 'Hương vị cà phê trứng Hà Nội: Ngọt đắng đan xen', category: 'Ẩm Thực', status: 'pending', date: '2024-05-24', views: 0 },
  { id: 2, title: 'Nét đẹp làng bích họa Tam Thanh', category: 'Điểm Đến', status: 'published', date: '2024-05-10', views: 1250 },
  { id: 3, title: 'Bánh xèo miền Trung khác miền Tây thế nào?', category: 'Ẩm Thực', status: 'published', date: '2024-04-20', views: 3400 },
  { id: 4, title: 'Ký sự chợ nổi Cái Răng', category: 'Văn Hóa', status: 'draft', date: '2024-05-27', views: 0 },
  { id: 5, title: 'Đêm đèn lồng Hội An', category: 'Văn Hóa', status: 'draft', date: '2024-05-28', views: 0 },
];

const CTVMyPosts = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [posts, setPosts] = useState(INITIAL_POSTS);

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'all') return true;
    return post.status === activeTab;
  });

  const handleSendApproval = (id) => {
    if(window.confirm('Bạn có chắc chắn muốn gửi bài viết này cho Ban biên tập duyệt?')) {
      setPosts(posts.map(p => p.id === id ? { ...p, status: 'pending' } : p));
      alert('Đã gửi phê duyệt thành công!');
    }
  };

  const handleDelete = (id) => {
    if(window.confirm('Bạn có muốn xóa bản nháp này không?')) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Bài Viết Của Tôi</h1>
          <p>Quản lý tất cả các bài viết, bản nháp và theo dõi trạng thái phê duyệt.</p>
        </div>
        <Link to="/ctv/my-posts/create" className="btn-primary" style={{ backgroundColor: '#10b981', textDecoration: 'none' }}>
          <Plus size={18} /> Viết bài mới
        </Link>
      </div>

      <div className="admin-card">
        {/* Table Toolbar */}
        <div className="table-toolbar">
          <div className="tabs">
            <button className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>Tất cả ({posts.length})</button>
            <button className={`tab-btn ${activeTab === 'draft' ? 'active' : ''}`} onClick={() => setActiveTab('draft')}>Bản nháp</button>
            <button className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>Đang chờ duyệt</button>
            <button className={`tab-btn ${activeTab === 'published' ? 'active' : ''}`} onClick={() => setActiveTab('published')}>Đã xuất bản</button>
          </div>
          
          <div className="toolbar-actions">
            <div className="search-box">
              <Search size={16} />
              <input type="text" placeholder="Tìm kiếm bài viết của bạn..." />
            </div>
            <button className="btn-outline">
              <Filter size={16} /> Lọc
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Chuyên mục</th>
                <th>Trạng thái</th>
                <th>Lượt xem</th>
                <th>Ngày tạo / Cập nhật</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map(post => (
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
                      <>
                        <button className="action-btn-text" style={{ borderColor: '#10b981', color: '#10b981' }} onClick={() => handleSendApproval(post.id)}>
                          <Send size={16} /> Gửi duyệt
                        </button>
                        <button className="action-icon primary" title="Chỉnh sửa"><Edit size={18} /></button>
                        <button className="action-icon danger" title="Xóa nháp" onClick={() => handleDelete(post.id)}><Trash2 size={18} /></button>
                      </>
                    )}
                    {post.status === 'pending' && (
                      <>
                         <button className="action-icon primary" title="Xem chi tiết"><Eye size={18} /></button>
                      </>
                    )}
                    {post.status === 'published' && (
                      <>
                        <button className="action-icon" style={{ color: '#64748b' }} title="Xem trên web"><Eye size={18} /></button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {filteredPosts.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center empty-state">Không tìm thấy bài viết nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="table-pagination">
          <span>Hiển thị 1-{filteredPosts.length} kết quả</span>
          <div className="pagination-controls">
            <button disabled>Trước</button>
            <button className="active" style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}>1</button>
            <button disabled>Sau</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTVMyPosts;
