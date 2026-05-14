import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const API = 'http://localhost:5000';

const decodeHtmlEntities = (str) => {
  if (!str) return '';
  return str
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&hellip;/g, '…').trim();
};

// Lấy URL ảnh: nếu có imageUrl riêng dùng imageUrl, không thì dùng fallback
const imgSrc = (item) =>
  item?.imageUrl ? `${API}${item.imageUrl}` : (item?.imageFallback || '');

// Default content — fallback khi API chưa sẵn sàng
const DEFAULT = {
  home_about: {
    badgeText: 'SỨ MỆNH CỦA CHÚNG TÔI',
    title: 'Lưu giữ và Lan tỏa\nTinh hoa Văn hóa Việt',
    description: 'CHÂN ĐI VÀ NẾM ra đời với khát vọng trở thành một thư viện sống động, nơi mỗi con đường bạn đi và mỗi món ăn bạn nếm đều kể một câu chuyện về lịch sử hàng nghìn năm của dân tộc.',
    ctaText: 'Tìm hiểu thêm về di sản →',
    ctaLink: '/about',
    imageFallback: 'https://images.unsplash.com/photo-1611077544837-124b89dc19d3?auto=format&fit=crop&q=80',
    quoteText: 'Mỗi tác phẩm là một câu chuyện về con người và vùng đất Việt.'
  },
  home_destinations: {
    sectionTitle: 'Hành trình Xuyên Việt',
    sectionSubtitle: 'Khám phá sự khác biệt tinh tế giữa ba miền đất nước.',
    cards: [
      { region: 'MIỀN BẮC', title: 'Hùng vĩ Đông Tây Bắc', imageFallback: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80', link: '/destinations', isMain: true },
      { region: 'MIỀN TRUNG', title: 'Di sản Cố đô', imageFallback: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80', link: '/destinations', isMain: false },
      { region: 'MIỀN NAM', title: 'Sông nước Cửu Long', imageFallback: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600', link: '/destinations', isMain: false },
    ]
  },
  home_foods: {
    sectionSubtitle: 'VỊ NGON XỨ VIỆT',
    sectionTitle: 'Đặc sản Tiêu biểu',
    cards: [
      { badge: 'HÀ NỘI', name: 'Phở Bò', description: 'Món ăn quốc hồn quốc túy với nước dùng thanh ngọt từ xương và hương hồi thảo quả đặc trưng.', imageFallback: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&q=80', link: '' },
      { badge: 'HUẾ', name: 'Bún Bò Huế', description: 'Đậm đà hương vị mắm ruốc, cay nồng ớt sa tế, nước dùng đỏ cam cuốn hút và tinh tế của người Huế.', imageFallback: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&q=80&w=500', link: '' },
      { badge: 'SÀI GÒN', name: 'Bánh Mì', description: 'Sự giao thoa văn hóa hoàn hảo giữa ổ bánh mì Pháp và nguyên liệu đặc trưng thuần Việt.', imageFallback: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=500', link: '' },
    ]
  }
};

const Home = () => {
  const [latestPosts, setLatestPosts] = useState([]);
  const [about, setAbout] = useState(DEFAULT.home_about);
  const [destinations, setDestinations] = useState(DEFAULT.home_destinations);
  const [foods, setFoods] = useState(DEFAULT.home_foods);
  const [culture, setCulture] = useState({ sectionTitle: 'Góc Nhìn Văn Hóa', featuredPostIds: [] });

  useEffect(() => {
    // 1. Lấy nội dung CMS trang chủ trước để biết có bài nào được xếp hạng không
    fetch(`${API}/api/site-content`)
      .then(r => r.ok ? r.json() : null)
      .then(async (data) => {
        if (!data) return;
        if (data.home_about) setAbout(data.home_about);
        if (data.home_destinations) setDestinations(data.home_destinations);
        if (data.home_foods) setFoods(data.home_foods);
        
        if (data.home_culture) {
          setCulture(data.home_culture);
          
          // 2. Nếu có bài viết được xếp hạng (featuredPostIds), fetch chúng
          if (data.home_culture.featuredPostIds?.length > 0) {
            const ids = data.home_culture.featuredPostIds;
            try {
              // Fetch bài viết theo danh sách ID
              const res = await fetch(`${API}/api/posts/published`);
              if (res.ok) {
                const allPosts = await res.json();
                // Lọc và sắp xếp theo đúng thứ tự ID đã chọn (Top 1, Top 2)
                const featured = ids.map(id => allPosts.find(p => p.id === id)).filter(Boolean);
                
                // Nếu tìm thấy đủ bài featured thì dùng, không thì fallback lấy bài mới nhất
                if (featured.length > 0) {
                  setLatestPosts(featured);
                  return; // Kết thúc sớm, không cần fetch default bên dưới
                }
              }
            } catch (err) { console.error('Lỗi lấy bài viết xếp hạng:', err); }
          }
        }

        // Fallback: Nếu không có bài xếp hạng hoặc lỗi, lấy bài mới nhất
        fetch(`${API}/api/posts/published`)
          .then(r => r.ok ? r.json() : [])
          .then(posts => setLatestPosts(posts.slice(0, 2)))
          .catch(() => {});
      })
      .catch(() => {
        // Fallback hoàn toàn nếu API site-content lỗi
        fetch(`${API}/api/posts/published`)
          .then(r => r.ok ? r.json() : [])
          .then(posts => setLatestPosts(posts.slice(0, 2)))
          .catch(() => {});
      });
  }, []);

  const mainCard = destinations.cards?.find(c => c.isMain) || destinations.cards?.[0];
  const smallCards = destinations.cards?.filter(c => !c.isMain) || [];

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80')" }}>
        <div className="container">
          <div className="hero-content">
            <span className="hero-tag">HÀNH TRÌNH ĐI ĐỂ TÌM</span>
            <h1>Khám Phá Tâm Hồn Đất Việt</h1>
            <p>Từ những đỉnh núi mờ sương phía Bắc đến những dòng sông đỏ nặng phù sa phương Nam, Việt Nam là một dải lụa giao thoa giữa cảnh sắc và hương vị.</p>
            <Link to="/blog" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>BẮT ĐẦU NGAY ↗</Link>
          </div>
        </div>
      </section>

      {/* ① SECTION SỨ MỆNH */}
      <section className="about">
        <div className="container">
          <div className="about-text">
            <span className="section-subtitle">{about.badgeText}</span>
            <h2>
              {about.title?.split('\n').map((line, i) => (
                <span key={i}>{line}{i < about.title.split('\n').length - 1 && <br />}</span>
              ))}
            </h2>
            <p>{about.description}</p>
            {about.ctaLink && (
              <Link to={about.ctaLink} className="link-primary">{about.ctaText}</Link>
            )}
          </div>
          <Link
            to={about.ctaLink || '/about'}
            className="about-image"
            title={about.ctaText || 'Tìm hiểu thêm'}
          >
            <img
              src={imgSrc(about)}
              alt={about.imageAlt || 'Ảnh giới thiệu'}
              onError={e => { e.target.src = about.imageFallback || ''; }}
            />
            {/* Overlay text chỉ hiện khi hover — không hiển thị khi ảnh bình thường */}
            {about.quoteText && (
              <div className="about-hover-text">
                <p>"{about.quoteText}"</p>
                <span>{about.ctaText || 'Tìm hiểu thêm →'}</span>
              </div>
            )}
          </Link>
        </div>
      </section>

      {/* ② SECTION HÀNH TRÌNH XUYÊN VIỆT */}
      <section className="destinations">
        <div className="container">
          <h2>{destinations.sectionTitle}</h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>{destinations.sectionSubtitle}</p>

          <div className="destinations-grid">
            {/* Card lớn */}
            {mainCard && (
              <Link to={mainCard.link || '#'} className="dest-card large" style={{ textDecoration: 'none' }}>
                <img src={imgSrc(mainCard)} alt={mainCard.title} />
                <div className="dest-content">
                  <span className="tag">{mainCard.region}</span>
                  <h3>{mainCard.title}</h3>
                </div>
              </Link>
            )}
            {/* Cards nhỏ */}
            <div className="dest-right-col">
              {smallCards.map((card, idx) => (
                <Link key={idx} to={card.link || '#'} className="dest-card small" style={{ textDecoration: 'none' }}>
                  <img src={imgSrc(card)} alt={card.title} />
                  <div className="dest-content">
                    <span className="tag">{card.region}</span>
                    <h3>{card.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ③ SECTION ĐẶC SẢN / QUẢNG CÁO */}
      <section className="foods">
        <div className="container">
          <span className="section-subtitle">{foods.sectionSubtitle}</span>
          <h2 className="section-title" style={{ marginBottom: 0 }}>{foods.sectionTitle}</h2>

          <div className="foods-grid">
            {foods.cards?.map((card, idx) => {
              const cardEl = (
                <div className="food-card" key={idx}>
                  <div className="food-img-wrapper">
                    <span className="food-tag">{card.badge}</span>
                    <img src={imgSrc(card)} alt={card.name} />
                  </div>
                  <div className="food-info">
                    <h3>{card.name}</h3>
                    <p>{card.description}</p>
                  </div>
                </div>
              );
              return card.link
                ? <Link key={idx} to={card.link} style={{ textDecoration: 'none', color: 'inherit' }}>{cardEl}</Link>
                : <React.Fragment key={idx}>{cardEl}</React.Fragment>;
            })}
          </div>
        </div>
      </section>

      {/* Culture / Bài viết mới */}
      <section className="culture">
        <div className="container">
          <div className="culture-header">
            <h2 className="section-title" style={{ margin: 0 }}>{culture.sectionTitle}</h2>
            <Link to="/blog" className="btn-primary" style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-dark)', border: '1px solid #ddd', textDecoration: 'none' }}>
              Xem tất cả bài viết
            </Link>
          </div>
          <div className="culture-grid">
            {latestPosts.length > 0 ? (
              latestPosts.map(post => (
                <div className="culture-card" key={post.id}>
                  <div className="culture-img">
                    <img
                      src={post.imageUrl ? `${API}${post.imageUrl}` : 'https://images.unsplash.com/photo-1600007283728-22aba3e1d6d8?auto=format&fit=crop&q=80'}
                      alt={post.title}
                    />
                  </div>
                  <div className="culture-info">
                    <span className="culture-tag">{post.category?.name || 'VĂN HÓA'}</span>
                    <h3><Link to={`/post/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>{post.title}</Link></h3>
                    <p>{decodeHtmlEntities(post.excerpt) || 'Đang cập nhật nội dung tóm tắt...'}</p>
                    <span className="culture-date">{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>Chưa có bài viết nào được xuất bản.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
