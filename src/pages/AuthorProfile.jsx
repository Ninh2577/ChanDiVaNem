import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Mail, Globe, Link as LinkIcon } from 'lucide-react';
import './AuthorProfile.css';

const AuthorProfile = () => {
  const { username } = useParams();
  const [author, setAuthor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching author profile and their posts
    const timer = window.setTimeout(() => {
      setIsLoading(true);
      setAuthor({
        name: username ? username.replace(/-/g, ' ').toUpperCase() : '',
        role: 'Nhà nghiên cứu văn hóa & Nhiếp ảnh gia',
        bio: 'Khát khao lưu giữ những giá trị văn hóa cốt lõi của người Việt qua từng khung hình và trang viết. Hơn 10 năm rong ruổi khắp mọi miền Tổ quốc, tôi tin rằng di sản là thứ cần được sống trong lòng thế hệ trẻ.',
        location: 'Hà Nội, Việt Nam',
        avatar: `https://ui-avatars.com/api/?name=${username ? username.replace(/-/g, '+') : 'A'}&background=fef3c7&color=d97706&size=200`,
        stats: {
          articles: 42,
          followers: 1250,
          views: '150K'
        },
        posts: [
          {
            id: 1,
            title: 'Những ngọn đèn lồng cuối cùng ở phố Hội',
            date: 'Tháng 12 10, 2023',
            image: 'https://images.unsplash.com/photo-1583417646194-672589255ce4?auto=format&fit=crop&q=80&w=600'
          },
          {
            id: 2,
            title: 'Vàng rực mùa lúa chín vùng cao',
            date: 'Tháng 10 05, 2023',
            image: 'https://images.unsplash.com/photo-1517594422361-5e18d03429ef?auto=format&fit=crop&q=80&w=600'
          }
        ]
      });
      setIsLoading(false);
    }, 600);
    return () => window.clearTimeout(timer);
  }, [username]);

  if (isLoading) {
    return (
      <div className="author-page-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!author) return null;

  return (
    <div className="author-profile-page">
      {/* Author Header Banner */}
      <div className="author-banner"></div>
      
      <div className="container author-container">
        <div className="author-sidebar">
          <div className="author-card">
            <img src={author.avatar} alt={author.name} className="author-avatar-large" />
            <h1 className="author-name">{author.name}</h1>
            <p className="author-role">{author.role}</p>
            
            <div className="author-stats">
              <div className="stat-item">
                <span className="stat-value">{author.stats.articles}</span>
                <span className="stat-label">Bài viết</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{author.stats.followers}</span>
                <span className="stat-label">Người theo dõi</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{author.stats.views}</span>
                <span className="stat-label">Lượt xem</span>
              </div>
            </div>

            <p className="author-bio">{author.bio}</p>

            <div className="author-details">
              <div className="detail-row">
                <MapPin size={16} /> <span>{author.location}</span>
              </div>
              <div className="detail-row">
                <Mail size={16} /> <span>Liên hệ công việc</span>
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
            <h2>Bài viết bởi {author.name}</h2>
          </div>
          
          <div className="author-posts-grid">
            {author.posts.map(post => (
              <div key={post.id} className="author-post-card">
                <Link to="/post/demo-slug" className="ap-img-link">
                  <img src={post.image} alt={post.title} />
                </Link>
                <div className="ap-content">
                  <span className="ap-date">{post.date}</span>
                  <h3><Link to="/post/demo-slug">{post.title}</Link></h3>
                  <Link to="/post/demo-slug" className="ap-read-more">Đọc bài →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorProfile;
