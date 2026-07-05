import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2 } from 'lucide-react';
import './SavedPosts.css';

const SavedPosts = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSavedPosts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để xem danh sách bài viết đã lưu.');
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/posts/saved-list/all', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setSavedPosts(data);
        } else {
          setError('Không thể lấy danh sách bài viết đã lưu.');
        }
      } catch (err) {
        console.error('Lỗi tải bài viết đã lưu:', err);
        setError('Lỗi kết nối máy chủ.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedPosts();
  }, []);

  const removePost = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/api/posts/${id}/unsave`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setSavedPosts(savedPosts.filter(post => post.id !== id));
      } else {
        alert('Bỏ lưu thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      alert('Lỗi kết nối.');
    }
  };

  return (
    <div className="saved-posts-page">
      <div className="saved-header">
        <div className="container">
          <h1>Bài Viết Đã Lưu</h1>
          <p>Lưu trữ những câu chuyện bạn yêu thích để đọc lại bất cứ lúc nào.</p>
        </div>
      </div>

      <div className="container saved-container">
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="no-saved-posts">
            <Bookmark size={48} className="no-saved-icon" />
            <h2>Yêu cầu đăng nhập</h2>
            <p>{error}</p>
            <Link to="/login" className="btn-explore">Đăng nhập ngay</Link>
          </div>
        ) : savedPosts.length > 0 ? (
          <div className="saved-grid">
            {savedPosts.map(post => (
              <div key={post.id} className="saved-card">
                <Link to={`/post/${post.slug}`} className="saved-img-link">
                  <img src={post.imageUrl ? `http://localhost:5000${post.imageUrl}` : 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&q=80&w=600'} alt={post.title} />
                  <span className="saved-category">{post.category?.name}</span>
                </Link>
                <div className="saved-content">
                  <span className="saved-date">{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                  <h3><Link to={`/post/${post.slug}`}>{post.title}</Link></h3>
                  <div className="saved-actions">
                    <Link to={`/post/${post.slug}`} className="read-more">Đọc ngay →</Link>
                    <button onClick={() => removePost(post.id)} className="btn-remove-saved" aria-label="Bỏ lưu">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-saved-posts">
            <Bookmark size={48} className="no-saved-icon" />
            <h2>Chưa có bài viết nào được lưu</h2>
            <p>Hãy khám phá các chuyên mục và lưu lại những bài viết bạn thấy thú vị nhé.</p>
            <Link to="/blog" className="btn-explore">Khám phá ngay</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPosts;
