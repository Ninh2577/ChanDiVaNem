import React, { useState, useEffect } from 'react';
import { Heart, Share2, Copy, Clock, Eye, ArrowLeft, BookOpen, Bookmark, Star } from 'lucide-react';
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
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [replyToId, setReplyToId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [ratingStats, setRatingStats] = useState({ averageScore: 0, totalCount: 0 });
  const [userRating, setUserRating] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [readProgress, setReadProgress] = useState(0);

  useEffect(() => {
    // Lấy thông tin user hiện tại
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }

    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/posts/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);

          // Cập nhật SEO Meta Tags
          document.title = data.metaTitle || data.title;

          // Tải danh sách bài viết liên quan (cùng categoryId và khác bài hiện tại)
          try {
            const relRes = await fetch('http://localhost:5000/api/posts/published');
            if (relRes.ok) {
              const allPublished = await relRes.json();
              const related = allPublished
                .filter(p => p.categoryId === data.categoryId && p.id !== data.id)
                .slice(0, 3);
              setRelatedPosts(related);
            }
          } catch (err) {
            console.error('Lỗi lấy bài viết liên quan:', err);
          }

          // Tải danh sách bình luận
          try {
            const commentsRes = await fetch(`http://localhost:5000/api/comments/post/${data.id}`);
            if (commentsRes.ok) {
              const commentsData = await commentsRes.json();
              setComments(commentsData);
            }
          } catch (err) {
            console.error('Lỗi tải bình luận:', err);
          }

          // Tải stats đánh giá
          try {
            const ratingRes = await fetch(`http://localhost:5000/api/ratings/post/${data.id}/stats`);
            if (ratingRes.ok) {
              setRatingStats(await ratingRes.json());
            }
          } catch (err) {
            console.error('Lỗi tải stats đánh giá:', err);
          }

          // Tải rating và danh sách đã lưu của user
          const token = localStorage.getItem('token');
          if (token) {
            try {
              const userRatingRes = await fetch(`http://localhost:5000/api/ratings/post/${data.id}/user`, {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              if (userRatingRes.ok) {
                const ratingData = await userRatingRes.json();
                setUserRating(ratingData.score);
              }
            } catch (err) {
              console.error('Lỗi tải rating của người dùng:', err);
            }

            try {
              const savedRes = await fetch(`http://localhost:5000/api/posts/saved-list/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              if (savedRes.ok) {
                const savedData = await savedRes.json();
                const found = savedData.some(p => p.id === data.id);
                setIsSaved(found);
              }
            } catch (err) {
              console.error('Lỗi tải bài viết đã lưu:', err);
            }
          }
          
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

  const handleRate = async (score) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vui lòng đăng nhập để đánh giá bài viết.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ postId: post.id, score })
      });

      if (res.ok) {
        const result = await res.json();
        setUserRating(score);
        setRatingStats(result.stats);
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Đánh giá thất bại.');
      }
    } catch (err) {
      alert('Không thể kết nối đến máy chủ.');
    }
  };

  const handleBookmarkToggle = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vui lòng đăng nhập để lưu bài viết.');
      return;
    }

    const url = isSaved 
      ? `http://localhost:5000/api/posts/${post.id}/unsave` 
      : `http://localhost:5000/api/posts/${post.id}/save`;
    const method = isSaved ? 'DELETE' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setIsSaved(!isSaved);
      } else {
        alert('Lưu bài viết thất bại.');
      }
    } catch (err) {
      alert('Không thể kết nối đến máy chủ.');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:5000/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ postId: post.id, content: commentText })
      });

      if (res.ok) {
        const result = await res.json();
        setComments([...comments, result.comment]);
        setCommentText('');
      } else {
        alert('Không thể đăng bình luận.');
      }
    } catch (err) {
      alert('Lỗi kết nối.');
    }
  };

  const handleReplySubmit = async (parentId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:5000/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ postId: post.id, content: replyText, parentId })
      });

      if (res.ok) {
        const result = await res.json();
        setComments([...comments, result.comment]);
        setReplyText('');
        setReplyToId(null);
      } else {
        alert('Không thể gửi phản hồi.');
      }
    } catch (err) {
      alert('Lỗi kết nối.');
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setComments(comments.filter(c => c.id !== commentId && c.parentId !== commentId));
      } else {
        alert('Không thể xóa bình luận.');
      }
    } catch (err) {
      alert('Lỗi kết nối.');
    }
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
            <button className={`action-btn ${isSaved ? 'copied' : ''}`} onClick={handleBookmarkToggle} title={isSaved ? "Bỏ lưu bài viết" : "Lưu bài viết"}>
              <Bookmark size={20} fill={isSaved ? '#d97706' : 'none'} stroke={isSaved ? '#d97706' : 'currentColor'} />
              <span>{isSaved ? 'Đã lưu' : 'Lưu bài'}</span>
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
      {/* Rating & Review Section */}
      <section className="post-rating-section">
        <div className="container-narrow">
          <div className="rating-card">
            <h3>Đánh giá bài viết</h3>
            <div className="rating-stars-wrap">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRate(star)}
                  className={`star-btn ${(userRating || 0) >= star ? 'active' : ''}`}
                >
                  <Star size={28} fill={(userRating || 0) >= star ? '#eab308' : 'none'} stroke={(userRating || 0) >= star ? '#eab308' : 'currentColor'} />
                </button>
              ))}
            </div>
            <p className="rating-stats-text">
              {ratingStats.averageScore > 0 
                ? `Điểm trung bình: ${ratingStats.averageScore}/5 (${ratingStats.totalCount} lượt đánh giá)`
                : 'Chưa có đánh giá nào cho bài viết này. Hãy là người đầu tiên đánh giá!'}
            </p>
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="post-comments-section">
        <div className="container-narrow">
          <div className="comments-header">
            <h3>Bình luận ({comments.length})</h3>
          </div>

          {/* Form viết bình luận chính */}
          <div className="comment-form-box">
            {currentUser ? (
              <form onSubmit={handleCommentSubmit}>
                <textarea
                  placeholder="Chia sẻ suy nghĩ của bạn về bài viết..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required
                />
                <button type="submit" className="btn-submit-comment">Gửi bình luận</button>
              </form>
            ) : (
              <div className="comment-login-prompt">
                <p>Vui lòng <Link to="/login">đăng nhập</Link> để viết bình luận.</p>
              </div>
            )}
          </div>

          {/* Danh sách bình luận */}
          <div className="comments-list">
            {comments.filter(c => !c.parentId).map(parentComment => (
              <div key={parentComment.id} className="comment-item-wrap">
                <div className="comment-item">
                  <img
                    src={parentComment.author?.avatarUrl ? `http://localhost:5000${parentComment.author.avatarUrl}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(parentComment.author?.fullName || 'A')}&background=9e3322&color=fff&size=80&bold=true`}
                    alt={parentComment.author?.fullName}
                    className="comment-avatar"
                  />
                  <div className="comment-content-box">
                    <div className="comment-meta">
                      <span className="comment-author">{parentComment.author?.fullName}</span>
                      <span className="comment-date">{new Date(parentComment.createdAt).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}</span>
                    </div>
                    <p className="comment-text">{parentComment.content}</p>
                    <div className="comment-actions">
                      {currentUser && (
                        <button onClick={() => setReplyToId(parentComment.id)} className="action-reply-btn">Trả lời</button>
                      )}
                      {(currentUser?.id === parentComment.authorId || currentUser?.role === 'ADMIN') && (
                        <button onClick={() => handleCommentDelete(parentComment.id)} className="action-delete-btn">Xóa</button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form trả lời bình luận */}
                {replyToId === parentComment.id && (
                  <div className="reply-form-box">
                    <textarea
                      placeholder={`Phản hồi bình luận của ${parentComment.author?.fullName}...`}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      required
                    />
                    <div className="reply-form-actions">
                      <button onClick={() => handleReplySubmit(parentComment.id)} className="btn-submit-reply">Gửi phản hồi</button>
                      <button onClick={() => setReplyToId(null)} className="btn-cancel-reply">Hủy</button>
                    </div>
                  </div>
                )}

                {/* Danh sách replies lồng */}
                <div className="comment-replies">
                  {comments.filter(c => c.parentId === parentComment.id).map(reply => (
                    <div key={reply.id} className="comment-item reply">
                      <img
                        src={reply.author?.avatarUrl ? `http://localhost:5000${reply.author.avatarUrl}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.author?.fullName || 'A')}&background=9e3322&color=fff&size=80&bold=true`}
                        alt={reply.author?.fullName}
                        className="comment-avatar"
                      />
                      <div className="comment-content-box">
                        <div className="comment-meta">
                          <span className="comment-author">{reply.author?.fullName}</span>
                          <span className="comment-date">{new Date(reply.createdAt).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}</span>
                        </div>
                        <p className="comment-text">{reply.content}</p>
                        <div className="comment-actions">
                          {(currentUser?.id === reply.authorId || currentUser?.role === 'ADMIN') && (
                            <button onClick={() => handleCommentDelete(reply.id)} className="action-delete-btn">Xóa</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="post-related-section">
          <div className="container">
            <h2 className="related-title">Bài viết liên quan</h2>
            <div className="related-grid">
              {relatedPosts.map(p => (
                <div className="related-card" key={p.id}>
                  <div className="related-img-wrap">
                    <img src={p.imageUrl ? `http://localhost:5000${p.imageUrl}` : 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=400'} alt={p.title} />
                  </div>
                  <div className="related-info">
                    <span className="related-cat">{p.category?.name}</span>
                    <h3>
                      <Link to={`/post/${p.slug}`}>
                        {p.title}
                      </Link>
                    </h3>
                    <span className="related-date">{new Date(p.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
