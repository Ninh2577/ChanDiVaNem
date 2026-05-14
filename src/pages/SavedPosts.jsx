import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2 } from 'lucide-react';
import './SavedPosts.css';

const SavedPosts = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an API or LocalStorage
    const timer = setTimeout(() => {
      setSavedPosts([
        {
          id: 1,
          title: 'Những ngọn đèn lồng cuối cùng ở phố Hội',
          category: 'Văn Hóa',
          date: '10/12/2023',
          image: 'https://images.unsplash.com/photo-1583417646194-672589255ce4?auto=format&fit=crop&q=80&w=600',
          slug: 'nhung-ngon-den-long-cuoi-cung'
        },
        {
          id: 2,
          title: 'Gia vị: Linh hồn của bếp Việt',
          category: 'Ẩm Thực',
          date: '15/11/2023',
          image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&q=80&w=600',
          slug: 'gia-vi-linh-hon-bep-viet'
        }
      ]);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const removePost = (id) => {
    setSavedPosts(savedPosts.filter(post => post.id !== id));
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
        ) : savedPosts.length > 0 ? (
          <div className="saved-grid">
            {savedPosts.map(post => (
              <div key={post.id} className="saved-card">
                <Link to={`/post/${post.slug}`} className="saved-img-link">
                  <img src={post.image} alt={post.title} />
                  <span className="saved-category">{post.category}</span>
                </Link>
                <div className="saved-content">
                  <span className="saved-date">{post.date}</span>
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
