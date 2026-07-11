import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Cuisine.css';

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

const Cuisine = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tối ưu SEO cho trang Ẩm thực
    document.title = "Ẩm thực - Hương vị truyền thống Việt Nam | Chân Đi Và Nếm";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Tìm hiểu các món ăn quốc hồn quốc túy, đặc sản ba miền, văn hóa cà phê độc đáo và tinh hoa ẩm thực truyền thống Việt Nam.";

    const fetchData = async () => {
      try {
        const [postsRes, catsRes] = await Promise.all([
          fetch('http://localhost:5000/api/posts/published'),
          fetch('http://localhost:5000/api/categories')
        ]);

        if (postsRes.ok && catsRes.ok) {
          const allPosts = await postsRes.json();
          const allCategories = await catsRes.json();

          const cuisineCat = allCategories.find(c => c.slug === 'am-thuc');
          if (cuisineCat) {
            const subCats = cuisineCat.children || [];
            setCategories(subCats);

            const cuisineIds = [cuisineCat.id, ...subCats.map(c => c.id)];
            const cuisinePosts = allPosts.filter(post => cuisineIds.includes(post.categoryId));
            setPosts(cuisinePosts);
          } else {
            setPosts(allPosts.filter(post => post.category?.slug?.includes('am-thuc')));
          }
        }
      } catch (error) {
        console.error('Lỗi lấy dữ liệu ẩm thực:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPosts = activeCategory === 'all'
    ? posts
    : posts.filter(post => post.categoryId === parseInt(activeCategory));

  const featuredPosts = filteredPosts.slice(0, 2);
  const remainingPosts = filteredPosts.slice(2);

  const getCategoryIcon = (slug) => {
    if (slug?.includes('nuoc')) return 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&q=80&w=400';
    if (slug?.includes('kho')) return 'https://images.unsplash.com/photo-1628198754117-73b88dcd1e61?auto=format&fit=crop&q=80&w=400';
    if (slug?.includes('vat')) return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400';
    return 'https://images.unsplash.com/photo-1538587888044-79f13ddd7e49?auto=format&fit=crop&q=80&w=400';
  };

  return (
    <div className="cuisine-page">
      <section className="cuisine-hero" style={{backgroundImage: "url('https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&q=80&w=2000')"}}>
        <div className="container">
          <div className="cuisine-hero-card">
            <span className="section-subtitle">HÀNH TRÌNH ẨM THỰC</span>
            <h1>Hương vị hồn Việt</h1>
            <p>Khám phá di sản tinh túy qua từng món ăn, từ những gánh hàng rong ven đường đến những bữa tiệc cung đình trang trọng.</p>
            <a href="#discover-section" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>Khám phá ngay</a>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="cuisine-categories" id="discover-section">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span className="section-subtitle">CHUYÊN MỤC ẨM THỰC</span>
              <h2>Khám phá theo danh mục</h2>
            </div>
            
            <div className="cat-grid">
              <div 
                className={`cat-card ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
                style={{ cursor: 'pointer' }}
              >
                <img src="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&q=80&w=400" alt="Tất cả" />
                <div className="cat-overlay">
                  <h3>Tất cả món ăn</h3>
                  <p>Xem toàn bộ công thức và câu chuyện</p>
                </div>
              </div>

              {categories.map(cat => (
                <div 
                  key={cat.id}
                  className={`cat-card ${activeCategory === String(cat.id) ? 'active' : ''}`}
                  onClick={() => setActiveCategory(String(cat.id))}
                  style={{ cursor: 'pointer' }}
                >
                  <img src={getCategoryIcon(cat.slug)} alt={cat.name} />
                  <div className="cat-overlay">
                    <h3>{cat.name}</h3>
                    <p>{cat.description || 'Khám phá văn hoá ẩm thực'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {featuredPosts.length > 0 && (
        <section className="featured-dishes">
          <div className="container">
            {featuredPosts.map((post, idx) => (
              <div className={`dish-row ${idx % 2 === 1 ? 'reverse' : ''}`} key={post.id}>
                <div className="dish-image">
                  <img 
                    src={post.imageUrl ? `http://localhost:5000${post.imageUrl}` : 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&q=80&w=800'} 
                    alt={post.thumbnailAlt || post.title} 
                  />
                </div>
                <div className="dish-content">
                  <span className="section-subtitle">{post.category?.name?.toUpperCase() || 'ẨM THỰC'}</span>
                  <h2>{post.title}</h2>
                  <p>{decodeHtmlEntities(post.excerpt)}</p>
                  
                  <Link to={`/post/${post.slug}`} className="btn-primary" style={{ display: 'inline-block', marginTop: '1.5rem', textDecoration: 'none' }}>
                    Khám phá câu chuyện
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {remainingPosts.length > 0 && (
        <section className="cuisine-grid-section" style={{ padding: '5rem 0', background: '#fafaf9' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span className="section-subtitle">GÓC CHIA SẺ ẨM THỰC</span>
              <h2>Các đặc sản & món ngon khác</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2.5rem' }}>
              {remainingPosts.map(post => (
                <div key={post.id} style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column' }}>
                  <img 
                    src={post.imageUrl ? `http://localhost:5000${post.imageUrl}` : "https://images.unsplash.com/photo-1583417646194-672589255ce4?auto=format&fit=crop&q=80&w=600"} 
                    alt={post.thumbnailAlt || post.title} 
                    style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: '1' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#9e3322', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{post.category?.name}</span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: '0 0 1rem' }}>
                      <Link to={`/post/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {post.title}
                      </Link>
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.6', marginBottom: '1.5rem' }}>{decodeHtmlEntities(post.excerpt)}</p>
                    <Link to={`/post/${post.slug}`} style={{ marginTop: 'auto', fontSize: '0.9rem', fontWeight: '600', color: '#9e3322', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      Đọc tiếp <span>→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="experience-section">
        <div className="container">
          <div className="text-center">
            <span className="section-subtitle">HỌC & TRẢI NGHIỆM</span>
            <h2>Trải nghiệm bếp Việt</h2>
          </div>
          
          <div className="bento-grid">
            <div className="bento-card bento-large-tl">
              <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1000" alt="Khóa học nấu ăn" />
              <div className="bento-overlay">
                <h3>Khóa học Nấu ăn Nghệ nhân</h3>
                <p>Học nấu ăn dưới sự hướng dẫn của nghệ nhân ẩm thực Việt Nam, trải nghiệm văn hóa ẩm thực tại Hội An.</p>
                <button className="btn-white">Đặt chỗ ngay</button>
              </div>
            </div>
            
            <div className="bento-card bento-small-tr bento-light">
              <div className="bento-content">
                <span className="bento-icon">🚶</span>
                <h3>Street Food Tour</h3>
                <p>Khám phá những viên ngọc ẩn giấu trong hẻm nhỏ Sài Gòn cùng hướng dẫn viên bản địa.</p>
                <a href="#" className="link-primary" style={{marginTop: 'auto'}}>Xem lịch trình →</a>
              </div>
            </div>
            
            <div className="bento-card bento-small-bl bento-brown">
              <div className="bento-content">
                <span className="bento-icon">☕</span>
                <h3 style={{color: 'white'}}>Hành trình Cà phê</h3>
                <p style={{color: 'rgba(255,255,255,0.8)'}}>Từ đồn điền Buôn Ma Thuột đến những ly cà phê muối độc đáo tại Huế.</p>
                <a href="#" style={{color: 'white', fontWeight: 600, marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>Tìm hiểu thêm →</a>
              </div>
            </div>
            
            <div className="bento-card bento-large-br bento-green">
              <div className="bento-content bento-row-layout">
                <div className="bento-text-part">
                  <h3 style={{color: 'white', fontSize: '1.8rem', marginBottom: '1rem'}}>Tiệc tối trên Sông Hương</h3>
                  <p style={{color: 'rgba(255,255,255,0.8)', marginBottom: '2rem'}}>Thưởng thức ẩm thực Cung đình Huế trên thuyền rồng, lắng nghe nhã nhạc trong không gian cổ kính.</p>
                  <button className="btn-white">Khám phá tiện ích</button>
                </div>
                <div className="bento-img-part">
                  <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=600" alt="Tiệc tối" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cuisine;
