import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Newsletter from '../components/Newsletter';
import './Destinations.css';

const decodeHtmlEntities = (str) => {
  if (!str) return '';
  return str
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
};

const Destinations = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRegion, setActiveRegion] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Tối ưu SEO cho trang Điểm Đến
    document.title = "Điểm đến - Hành trình khám phá Việt Nam | Chân Đi Và Nếm";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Khám phá cẩm nang du lịch và câu chuyện di sản tại các địa danh nổi tiếng trải dài ba miền Bắc - Trung - Nam của đất nước hình chữ S.";

    const fetchData = async () => {
      try {
        const [postsRes, catsRes] = await Promise.all([
          fetch('http://localhost:5000/api/posts/published'),
          fetch('http://localhost:5000/api/categories')
        ]);

        if (postsRes.ok && catsRes.ok) {
          const allPosts = await postsRes.json();
          const allCategories = await catsRes.json();

          // Tìm danh mục Điểm đến (slug: diem-den) và các danh mục con của nó
          const destCategory = allCategories.find(c => c.slug === 'diem-den');
          if (destCategory) {
            const destIds = [destCategory.id, ...(destCategory.children?.map(c => c.id) || [])];
            // Lọc các bài viết thuộc các danh mục này
            const destPosts = allPosts.filter(post => destIds.includes(post.categoryId));
            setPosts(destPosts);
          } else {
            // Fallback nếu không thấy category diem-den, lọc theo từ khóa hoặc lấy tất cả
            setPosts(allPosts.filter(post => post.category?.slug?.includes('diem-den')));
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu điểm đến:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Bộ lọc vùng miền thông minh
  const getFilteredPosts = () => {
    let filtered = posts;

    // Lọc theo vùng miền
    if (activeRegion === 'north') {
      filtered = posts.filter(post => 
        post.category?.name?.toLowerCase().includes('bac') || 
        post.category?.slug?.toLowerCase().includes('bac') ||
        post.title?.toLowerCase().includes('bắc')
      );
    } else if (activeRegion === 'central') {
      filtered = posts.filter(post => 
        post.category?.name?.toLowerCase().includes('trung') || 
        post.category?.slug?.toLowerCase().includes('trung') ||
        post.title?.toLowerCase().includes('trung')
      );
    } else if (activeRegion === 'south') {
      filtered = posts.filter(post => 
        post.category?.name?.toLowerCase().includes('nam') || 
        post.category?.slug?.toLowerCase().includes('nam') ||
        post.title?.toLowerCase().includes('nam')
      );
    }

    // Lọc theo ô tìm kiếm
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.title?.toLowerCase().includes(q) || 
        post.excerpt?.toLowerCase().includes(q) ||
        post.category?.name?.toLowerCase().includes(q)
      );
    }

    return filtered;
  };

  const filteredPosts = getFilteredPosts();
  const largeFeaturedPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const gridPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];

  return (
    <div className="destinations-page">
      {/* Hero Section */}
      <section className="dest-hero">
        <div className="container">
          <span className="dest-tag">HÀNH TRÌNH VIỆT NAM</span>
          <h1>Khám phá dải đất<br/>hình chữ S</h1>
          <p>Từ những đỉnh núi mờ sương phía Bắc đến những bãi cát vàng miền Nam, mỗi điểm đến là một chương mới trong cuốn nhật ký hành trình xuyên qua tâm hồn Việt.</p>
        </div>
      </section>

      {/* Filter & Map Section */}
      <section className="dest-map-section">
        <div className="container">
          <div className="map-grid">
            {/* Sidebar */}
            <div className="map-sidebar">
              <h3>Bộ lọc khu vực</h3>
              <div className="filter-list">
                <button 
                  className={`filter-btn ${activeRegion === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveRegion('all')}
                >
                  Tất cả điểm đến <span>›</span>
                </button>
                <button 
                  className={`filter-btn ${activeRegion === 'north' ? 'active' : ''}`}
                  onClick={() => setActiveRegion('north')}
                >
                  Miền Bắc <span>›</span>
                </button>
                <button 
                  className={`filter-btn ${activeRegion === 'central' ? 'active' : ''}`}
                  onClick={() => setActiveRegion('central')}
                >
                  Miền Trung <span>›</span>
                </button>
                <button 
                  className={`filter-btn ${activeRegion === 'south' ? 'active' : ''}`}
                  onClick={() => setActiveRegion('south')}
                >
                  Miền Nam <span>›</span>
                </button>
              </div>
              
              <div className="search-box-wrap">
                <span className="search-label">TÌM KIẾM ĐỊA DANH</span>
                <div className="search-input-container">
                  <input 
                    type="text" 
                    placeholder="Hà Giang, Hội An..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <span className="search-icon">🔍</span>
                </div>
              </div>
            </div>
            
            {/* Map Area */}
            <div className="map-area">
              <img src="https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80&w=1200" alt="Bản đồ Việt Nam" className="map-bg" />
              
              {/* Map Dots */}
              <div className="map-dot" style={{top: '30%', left: '40%'}}></div>
              <div className="map-dot" style={{top: '45%', left: '60%'}}></div>
              <div className="map-dot" style={{top: '70%', left: '45%'}}></div>
              
              <div className="map-card">
                <h4>Bản đồ Di sản</h4>
                <p>Khám phá những điểm đến tuyệt vời trên bản đồ để tìm hiểu những câu chuyện di sản và ẩm thực đặc trưng nhất của đất Việt.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header-row">
            <h2>Các điểm đến nổi bật ({filteredPosts.length})</h2>
            <Link to="/blog" className="view-all-link">Xem tất cả bài viết →</Link>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-light)' }}>
              Đang tải danh sách điểm đến...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-light)' }}>
              Không tìm thấy bài viết điểm đến nào phù hợp với bộ lọc hiện tại.
            </div>
          ) : (
            <div className="featured-grid">
              {/* Large Card */}
              {largeFeaturedPost && (
                <div className="feat-card feat-large">
                  <img 
                    src={largeFeaturedPost.imageUrl ? `http://localhost:5000${largeFeaturedPost.imageUrl}` : "https://images.unsplash.com/photo-1542013897-40da8bc3257a?auto=format&fit=crop&q=80&w=1000"} 
                    alt={largeFeaturedPost.thumbnailAlt || largeFeaturedPost.title} 
                  />
                  <div className="feat-content-overlay">
                    <span className="feat-tag">{largeFeaturedPost.category?.name?.toUpperCase() || 'MIỀN BẮC'}</span>
                    <h3>{largeFeaturedPost.title}</h3>
                    <p>{decodeHtmlEntities(largeFeaturedPost.excerpt)}</p>
                    <Link to={`/post/${largeFeaturedPost.slug}`} className="btn-primary">Khám phá ngay</Link>
                  </div>
                </div>
              )}
              
              {/* Standard Cards */}
              {gridPosts.map(post => (
                <div className="feat-card" key={post.id}>
                  <img 
                    src={post.imageUrl ? `http://localhost:5000${post.imageUrl}` : "https://images.unsplash.com/photo-1583417646194-672589255ce4?auto=format&fit=crop&q=80&w=600"} 
                    alt={post.thumbnailAlt || post.title} 
                  />
                  <div className="feat-content">
                    <span className="feat-tag">{post.category?.name?.toUpperCase() || 'HÀNH TRÌNH'}</span>
                    <h3>
                      <Link to={`/post/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {post.title}
                      </Link>
                    </h3>
                    <p>{decodeHtmlEntities(post.excerpt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section with custom text */}
      <Newsletter 
        title="Bạn đã sẵn sàng viết tiếp hành trình của mình?"
        description="Đăng ký nhận bản tin định kỳ để không bỏ lỡ những điểm đến mới lạ và những câu chuyện văn hóa sâu sắc nhất."
      />
    </div>
  );
};

export default Destinations;
