import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User, LayoutGrid } from 'lucide-react';
import Newsletter from '../components/Newsletter';
import './Blog.css';

const decodeHtmlEntities = (str) => {
  if (!str) return '';
  return str
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&hellip;/g, '…')
    .trim();
};

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tối ưu SEO cho trang Tin tức / Blog
    document.title = "Trang tin tức & Câu chuyện chia sẻ | Chân Đi Và Nếm";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Nơi tổng hợp các bài viết trải nghiệm du lịch, ẩm thực và văn hóa chất lượng cao từ đội ngũ biên tập viên và cộng tác viên.";

    const fetchData = async () => {
      try {
        const [postsRes, catsRes] = await Promise.all([
          fetch('http://localhost:5000/api/posts/published'),
          fetch('http://localhost:5000/api/categories')
        ]);
        
        if (postsRes.ok) setPosts(await postsRes.json());
        if (catsRes.ok) setCategories(await catsRes.json());
      } catch (error) {
        console.error('Lỗi lấy dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPosts = activeCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category?.id === activeCategory);

  const featuredPost = posts.length > 0 ? posts[0] : null;
  // Luôn hiển thị toàn bộ bài viết trong grid, không bỏ qua bài nào
  const displayPosts = filteredPosts;

  return (
    <div className="blog-page">
      {/* Premium Immersive Hero */}
      {featuredPost && activeCategory === 'all' && (
        <section className="blog-premium-hero">
          <div className="hero-bg-wrapper">
            <img 
              src={featuredPost.imageUrl ? `http://localhost:5000${featuredPost.imageUrl}` : "https://images.unsplash.com/photo-1542013897-40da8bc3257a?auto=format&fit=crop&q=80&w=1600"} 
              alt="Featured" 
            />
            <div className="hero-overlay"></div>
          </div>
          
          <div className="container">
            <div className="hero-content-inner">
              <div className="featured-glass-card">
                <span className="feat-badge">BÀI VIẾT NỔI BẬT</span>
                <h1>{featuredPost.title}</h1>
                <p>{decodeHtmlEntities(featuredPost.excerpt)}</p>
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={16} /> {featuredPost.author?.fullName}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} /> {new Date(featuredPost.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
                <Link to={`/post/${featuredPost.slug}`} className="btn-premium">
                  Đọc ngay <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog List Section */}
      <section className="blog-list-section">
        <div className="container">
          
          {/* Section Heading for Grid */}
          <div className="blog-controls">
            <div className="blog-filters">
              <button 
                className={`filter-pill ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                <LayoutGrid size={16} style={{marginRight: '0.5rem', verticalAlign: 'middle'}}/> Tất cả bài viết
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  className={`filter-pill ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            
            <div className="blog-sort">
              <select className="sort-select" style={{ border: 'none', background: 'transparent', fontWeight: 700, color: '#475569', cursor: 'pointer', outline: 'none' }}>
                <option>Mới nhất</option>
                <option>Cũ nhất</option>
                <option>Lượt xem</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="blog-grid">
            {loading ? (
              <p>Đang tải danh sách bài viết...</p>
            ) : displayPosts.length > 0 ? (
              displayPosts.map(post => (
                <Link to={`/post/${post.slug}`} className="blog-card" key={post.id} style={{textDecoration: 'none'}}>
                  <div className="blog-card-img">
                    <img src={post.imageUrl ? `http://localhost:5000${post.imageUrl}` : "https://via.placeholder.com/600x400"} alt={post.title} />
                    <span className="card-tag">{post.category?.name || 'CHUNG'}</span>
                  </div>
                  <div className="blog-card-content">
                    <div className="blog-meta">
                      {new Date(post.createdAt).toLocaleDateString('vi-VN')} • {post.author?.fullName || 'Khuyết danh'}
                    </div>
                    <h3>{post.title}</h3>
                    <p>{decodeHtmlEntities(post.excerpt)}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p>Không có bài viết nào trong danh mục này.</p>
            )}
          </div>

          {/* Pagination */}
          {displayPosts.length > 0 && (
            <div className="pagination">
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
            </div>
          )}

        </div>
      </section>

      {/* Newsletter Section */}
      <Newsletter 
        title="Nhận tin bài mới nhất"
        description="Để không bỏ lỡ những kinh nghiệm du lịch quý giá và những câu chuyện văn hóa độc đáo từ khắp mọi miền Việt Nam."
        buttonText="Đăng ký ngay"
        theme="light"
      />

    </div>
  );
};

export default Blog;
