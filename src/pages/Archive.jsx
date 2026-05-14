import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import './Archive.css';

const Archive = () => {
  const { slug } = useParams();
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Determine if it's a tag or category based on URL
  const isTag = location.pathname.includes('/tag/');
  const typeLabel = isTag ? 'Tag' : 'Chuyên mục';
  const displayTitle = slug ? slug.replace(/-/g, ' ').toUpperCase() : '';

  useEffect(() => {
    // Simulate API fetch based on tag or category slug
    const timer = window.setTimeout(() => {
      setIsLoading(true);
      setPosts([
        {
          id: 1,
          title: `Những câu chuyện chưa kể về ${displayTitle}`,
          excerpt: `Khám phá những nét đặc sắc và giá trị tiềm ẩn của ${displayTitle} qua lăng kính mới lạ.`,
          date: '10/05/2024',
          author: 'Minh Anh',
          image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&q=80&w=800'
        },
        {
          id: 2,
          title: `Hành trình tìm lại ký ức tại ${displayTitle}`,
          excerpt: `Một chuyến đi đầy cảm xúc để sống lại những hoài niệm đẹp nhất về ${displayTitle}.`,
          date: '22/04/2024',
          author: 'Nam Nguyễn',
          image: 'https://images.unsplash.com/photo-1542640244-7e672d6cb466?auto=format&fit=crop&q=80&w=800'
        }
      ]);
      setIsLoading(false);
    }, 600);

    return () => window.clearTimeout(timer);
  }, [displayTitle, slug]);

  return (
    <div className="archive-page">
      <div className="archive-header">
        <div className="container">
          <span className="archive-label">{typeLabel}</span>
          <h1 className="archive-title">{displayTitle}</h1>
          <p className="archive-subtitle">Khám phá tất cả các bài viết liên quan đến {displayTitle}</p>
        </div>
      </div>

      <div className="container archive-container">
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang tải bài viết...</p>
          </div>
        ) : (
          <div className="archive-grid">
            {posts.map(post => (
              <article key={post.id} className="archive-card">
                <Link to="/post/demo-slug" className="archive-img-link">
                  <img src={post.image} alt={post.title} />
                </Link>
                <div className="archive-content">
                  <div className="archive-meta">
                    <span>{post.date}</span>
                    <span className="separator">•</span>
                    <Link to={`/author/${post.author.toLowerCase().replace(' ', '-')}`}>{post.author}</Link>
                  </div>
                  <h2><Link to="/post/demo-slug">{post.title}</Link></h2>
                  <p>{post.excerpt}</p>
                  <Link to="/post/demo-slug" className="read-more">Đọc thêm →</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Archive;
