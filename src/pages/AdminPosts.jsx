import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import Pagination from '../components/Pagination';
import './AdminTable.css';

const AdminPosts = () => {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get('category') || '';

  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(8);
  const [status, setStatus] = useState('all');
  const [categoryId, setCategoryId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Lấy danh sách danh mục để làm bộ lọc
  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/categories');
      if (res.ok) {
        setCategories(await res.json());
      }
    } catch (error) {
      console.error('Lỗi tải danh mục:', error);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:5000/api/posts?page=${page}&limit=${limit}`;
      if (status !== 'all') {
        url += `&status=${status}`;
      }
      if (categoryId) {
        url += `&categoryId=${categoryId}`;
      }
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
        }
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bài viết:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      if (categorySlug) {
        const found = categories.find(c => c.slug === categorySlug);
        if (found) {
          setCategoryId(found.id.toString());
        }
      } else {
        setCategoryId('');
      }
    }
  }, [categorySlug, categories]);

  useEffect(() => {
    fetchPosts();
  }, [page, status, categoryId]);

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

  // Lọc bài viết theo ô tìm kiếm phía client
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <button className={`tab-btn ${status === 'all' ? 'active' : ''}`} onClick={() => { setStatus('all'); setPage(1); }}>Tất cả</button>
            <button className={`tab-btn ${status === 'published' ? 'active' : ''}`} onClick={() => { setStatus('published'); setPage(1); }}>Đã xuất bản</button>
            <button className={`tab-btn ${status === 'pending' ? 'active' : ''}`} onClick={() => { setStatus('pending'); setPage(1); }}>Chờ duyệt</button>
          </div>
          
          <div className="toolbar-actions" style={{ display: 'flex', gap: '10px' }}>
            <select 
              value={categoryId} 
              onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
              className="filter-select"
              style={{ padding: '6px 12px', border: '1px solid #cbd5e0', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
            >
              <option value="">Lọc theo Danh mục</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <div className="search-box">
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Tìm kiếm bài viết..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
              ) : filteredPosts.length === 0 ? (
                <tr><td colSpan="6" className="text-center empty-state">Chưa có bài viết nào phù hợp.</td></tr>
              ) : (
                filteredPosts.map(post => (
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

        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          onPageChange={(p) => setPage(p)} 
        />
      </div>
    </div>
  );
};

export default AdminPosts;
