import React, { useState, useEffect } from 'react';
import { Heart, Share2, Copy, Clock, Eye, ArrowLeft, BookOpen } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './PostDetail.css';

// Hàm giải mã HTML entities thành text thuần
const decodeHtmlEntities = (str) => {
  if (!str) return '';
  return str
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&hellip;/g, '…');
};

// Tính thời gian đọc ước lượng
const calcReadTime = (content) => {
  if (!content) return 1;
  const text = content.replace(/<[^>]*>?/gm, '');
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
};

// Hàm copy link
const copyLink = () => {
  navigator.clipboard.writeText(window.location.href);
};

const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [readProgress, setReadProgress] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/posts/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
          
          // Cập nhật SEO Meta Tags
          document.title = data.metaTitle || data.title;
          
          // Meta Description
          let metaDesc = document.querySelector('meta[name="description"]');
          if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
          }
          metaDesc.content = data.metaDesc || data.excerpt || '';

          // Canonical Link
          if (data.canonicalUrl) {
            let canonical = document.querySelector('link[rel="canonical"]');
            if (!canonical) {
              canonical = document.createElement('link');
              canonical.rel = 'canonical';
              document.head.appendChild(canonical);
            }
            canonical.href = data.canonicalUrl;
          }
        } else {
          setError('Không tìm thấy bài viết này.');
        }
      } catch {
        setError('Lỗi kết nối máy chủ.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();

    // Cleanup when leaving page
    return () => {
      document.title = 'CHÂN ĐI VÀ NẾM';
    };
  }, [slug]);

  // Thanh progress đọc bài
  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      setReadProgress(docHeight > 0 ? (scrolled / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopy = () => {
    copyLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="post-loading">
      <div className="post-loading-spinner"></div>
      <p>Đang tải nội dung...</p>
    </div>
  );

  if (error || !post) return (
    <div className="post-error">
      <BookOpen size={64} color="#cbd5e1" />
      <h2>Bài viết không tồn tại</h2>
      <p>{error || 'Nội dung bạn tìm kiếm không còn tồn tại hoặc đã bị xóa.'}</p>
      <button className="btn-back" onClick={() => navigate('/blog')}>
        <ArrowLeft size={16} /> Quay lại Blog
      </button>
    </div>
  );

  const readTime = calcReadTime(post.content);
  const cleanExcerpt = decodeHtmlEntities(post.excerpt);
  const authorName = post.author?.fullName || 'Ban biên tập';
  const avatarUrl = post.author?.avatarUrl
    ? `http://localhost:5000${post.author.avatarUrl}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=9e3322&color=fff&size=80&bold=true`;

  return (
    <div className="post-detail-page">
      {/* Reading progress bar */}
      <div className="read-progress-bar">
        <div className="read-progress-fill" style={{ width: `${readProgress}%` }} />
      </div>

      {/* Breadcrumb */}
      <nav className="post-breadcrumb">
        <div className="container">
          <Link to="/blog" className="breadcrumb-back">
            <ArrowLeft size={16} /> Quay lại Blog
          </Link>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-cat">{post.category?.name || 'Bài viết'}</span>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="post-hero">
        <div className="post-hero-inner">
          <div className="post-category-badge">{post.category?.name?.toUpperCase() || 'VĂN HÓA'}</div>
          {/* SEO: H1 duy nhất cho tiêu đề bài viết */}
          <h1 className="post-title">{post.title}</h1>

          {cleanExcerpt && !cleanExcerpt.includes('&') && (
            <p className="post-subtitle">{cleanExcerpt}</p>
          )}

          <div className="post-meta-row">
            <div className="post-author-mini">
              <img src={avatarUrl} alt={authorName} className="post-author-avatar" />
              <div>
                <span className="post-author-name">{authorName}</span>
                <span className="post-author-role">Tác giả</span>
              </div>
            </div>
            <div className="post-stats">
              <span className="post-stat"><Clock size={14} /> {readTime} phút đọc</span>
              <span className="post-stat-sep">·</span>
              <span className="post-stat"><Eye size={14} /> {post.viewCount || 0} lượt xem</span>
              <span className="post-stat-sep">·</span>
              <span className="post-stat">{new Date(post.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Cover Image - SEO: Sử dụng thumbnailAlt */}
      <div className="post-cover-wrap">
        <img
          src={post.imageUrl ? `http://localhost:5000${post.imageUrl}` : 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=1200'}
          alt={post.thumbnailAlt || post.title}
          className="post-cover-img"
        />
      </div>

      {/* Article body */}
      <div className="post-body-wrap">
        {/* Sticky Share Sidebar */}
        <aside className="post-share-sidebar">
          <div className="sticky-actions">
            <button className={`action-btn ${liked ? 'liked' : ''}`} onClick={() => setLiked(!liked)} title="Thích bài viết">
              <Heart size={20} fill={liked ? '#e11d48' : 'none'} stroke={liked ? '#e11d48' : 'currentColor'} />
              <span>{liked ? 'Đã thích' : 'Thích'}</span>
            </button>
            <button className="action-btn" onClick={() => navigator.share?.({ title: post.title, url: window.location.href })} title="Chia sẻ">
              <Share2 size={20} />
              <span>Chia sẻ</span>
            </button>
            <button className={`action-btn ${copied ? 'copied' : ''}`} onClick={handleCopy} title="Sao chép liên kết">
              <Copy size={20} />
              <span>{copied ? 'Đã copy!' : 'Copy link'}</span>
            </button>
          </div>
        </aside>

        {/* Main Article Content */}
        <article
          className="post-content ql-editor-rendered"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="post-tags-section">
          <div className="container-narrow">
            {post.tags.map(tag => (
              <span key={tag.id} className="post-tag">#{tag.name}</span>
            ))}
          </div>
        </div>
      )}

      {/* Author Bio */}
      <div className="post-author-bio">
        <div className="container-narrow">
          <div className="bio-card">
            <img src={avatarUrl} alt={authorName} className="bio-avatar" />
            <div className="bio-text">
              <span className="bio-label">Bài viết bởi</span>
              <h3 className="bio-name">{authorName}</h3>
              <p className="bio-desc">
                {post.author?.bio || 'Tác giả là người đóng góp nội dung cho CHÂN ĐI VÀ NẾM — nền tảng chia sẻ văn hoá và ẩm thực Việt Nam.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA / Back to blog */}
      <div className="post-footer-cta">
        <div className="container-narrow">
          <Link to="/blog" className="btn-explore">
            <ArrowLeft size={16} /> Xem thêm bài viết
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
