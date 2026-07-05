import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Mail, Globe, Link as LinkIcon, AlertCircle } from 'lucide-react';
import './AuthorProfile.css';

const translateRole = (role) => {
  if (role === 'ADMIN') return 'Quản trị viên';
  if (role === 'CTV') return 'Cộng tác viên / Tác giả';
  return 'Độc giả';
};

const AuthorProfile = () => {
  const { username } = useParams();
  const [author, setAuthor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5000/api/users/profile/${username}`);
        if (res.ok) {
          const data = await res.json();
          setAuthor(data);
        } else {
          setError('Không tìm thấy tác giả này hoặc hồ sơ không tồn tại.');
        }
      } catch (err) {
        console.error('Lỗi khi lấy thông tin tác giả:', err);
        setError('Lỗi kết nối máy chủ.');
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  if (isLoading) {
    return (
      <div className="author-page-loading">
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-light)' }}>Đang tải hồ sơ tác giả...</p>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="author-page-loading" style={{ flexDirection: 'column', gap: '1rem', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <AlertCircle size={48} color="#9e3322" />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-dark)' }}>Hồ sơ tác giả không khả dụng</h2>
        <p style={{ color: 'var(--text-light)', maxWidth: '400px' }}>{error || 'Đã có lỗi xảy ra.'}</p>
        <Link to="/blog" style={{ color: '#9e3322', fontWeight: 600, textDecoration: 'none', marginTop: '1rem' }}>Quay lại Trang tin tức</Link>
      </div>
    );
  }

  const avatarUrl = author.avatarUrl
    ? `http://localhost:5000${author.avatarUrl}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(author.fullName)}&background=fef3c7&color=d97706&size=200&bold=true`;

  const totalViews = author.posts?.reduce((sum, post) => sum + (post.viewCount || 0), 0) || 0;

  return (
    <div className="author-profile-page">
      {/* Author Header Banner */}
      <div className="author-banner"></div>
      
      <div className="container author-container">
        <div className="author-sidebar">
          <div className="author-card">
            <img src={avatarUrl} alt={author.fullName} className="author-avatar-large" />
            <h1 className="author-name">{author.fullName}</h1>
            <p className="author-role">{translateRole(author.role)}</p>
            
            <div className="author-stats">
              <div className="stat-item">
                <span className="stat-value">{author.posts?.length || 0}</span>
                <span className="stat-label">Bài viết</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}k` : totalViews}</span>
                <span className="stat-label">Lượt xem</span>
              </div>
            </div>

            <p className="author-bio">{author.bio || 'Chưa có bài viết tự bạch chi tiết nào từ tác giả này.'}</p>

            <div className="author-details">
              <div className="detail-row">
                <MapPin size={16} /> <span>Việt Nam</span>
              </div>
              <div className="detail-row">
                <Mail size={16} /> <span>{author.email}</span>
              </div>
            </div>

            <div className="author-social">
              <a href="#" className="social-link"><Globe size={20} /></a>
              <a href="#" className="social-link"><LinkIcon size={20} /></a>
            </div>

            <button className="btn-follow">Theo dõi</button>
          </div>
        </div>

        <div className="author-main-content">
          <div className="content-header">
            <h2>Bài viết bởi {author.fullName} ({author.posts?.length || 0})</h2>
          </div>
          
          {author.posts?.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>
              Tác giả chưa xuất bản bài viết nào.
            </div>
          ) : (
            <div className="author-posts-grid">
              {author.posts.map(post => (
                <div key={post.id} className="author-post-card">
                  <Link to={`/post/${post.slug}`} className="ap-img-link">
                    <img 
                      src={post.imageUrl ? `http://localhost:5000${post.imageUrl}` : 'https://images.unsplash.com/photo-1583417646194-672589255ce4?auto=format&fit=crop&q=80&w=600'} 
                      alt={post.title} 
                    />
                  </Link>
                  <div className="ap-content">
                    <span className="ap-date">{new Date(post.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                    <h3><Link to={`/post/${post.slug}`}>{post.title}</Link></h3>
                    <Link to={`/post/${post.slug}`} className="ap-read-more">Đọc bài →</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorProfile;
