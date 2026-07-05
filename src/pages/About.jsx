import React, { useState, useEffect } from 'react';
import './About.css';

const API = 'http://localhost:5000';

const DEFAULT_ABOUT = {
  heroTitle: 'Gìn giữ hồn\nViệt qua từng\nbước chân.',
  heroSubtitle: 'HÀNH TRÌNH TÂM HỒN',
  heroDescription: 'Chúng tôi không chỉ kể chuyện. Chúng tôi lưu trữ những giá trị hữu hình và vô hình của một Việt Nam rực rỡ.',
  heroImageUrl: '',
  storyTitle: 'Câu chuyện\nThương hiệu',
  storyDescription1: 'Bắt đầu từ niềm đam mê bất tận với những cung đường vắt ngang đồi chè và hương vị mộc mạc của gánh hàng rong ven đô, CHÂN ĐI VÀ NẾM ra đời như một cuốn nhật ký sống động.',
  storyDescription2: 'Chúng tôi tin rằng văn hóa không nằm trong bảo tàng; nó nằm trong cách một nghệ nhân nâng niu thớ lụa, cách một bà cụ nêm nếm bát phở sáng, và cách người trẻ tìm về nguồn cội bằng góc nhìn đương đại.',
  storyImageUrl1: '',
  storyImageUrl2: '',
  storyImageUrl3: '',
  visionText: 'Trở thành nền tảng truyền thông di sản hàng đầu, đưa vẻ đẹp đích thực của Việt Nam đến với cộng đồng quốc tế thông qua những trải nghiệm thị giác và nội dung có chiều sâu nghệ thuật.',
  missionText1: 'Quảng bá văn hóa & ẩm thực bền vững.',
  missionText2: 'Hỗ trợ cộng đồng nghệ nhân địa phương.',
  missionText3: 'Tạo ra hệ sinh thái du lịch văn hóa tử tế.',
};

const About = () => {
  const [data, setData] = useState(DEFAULT_ABOUT);

  useEffect(() => {
    fetch(`${API}/api/site-content/page_about`)
      .then(res => res.ok ? res.json() : null)
      .then(resData => {
        if (resData) {
          setData(prev => ({ ...prev, ...resData }));
        }
      })
      .catch(() => console.warn('Sử dụng dữ liệu Giới thiệu mặc định.'));
  }, []);

  const heroBg = data.heroImageUrl ? `${API}${data.heroImageUrl}` : "https://images.unsplash.com/photo-1542013897-40da8bc3257a?auto=format&fit=crop&q=80&w=1200";
  const storyImg1 = data.storyImageUrl1 ? `${API}${data.storyImageUrl1}` : "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&q=80&w=600";
  const storyImg2 = data.storyImageUrl2 ? `${API}${data.storyImageUrl2}` : "https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&q=80&w=600";
  const storyImg3 = data.storyImageUrl3 ? `${API}${data.storyImageUrl3}` : "https://images.unsplash.com/photo-1583417646194-672589255ce4?auto=format&fit=crop&q=80&w=600";

  return (
    <div className="about-main-page">
      <div className="privacy-layout">
        
        {/* Sidebar */}
        <aside className="privacy-sidebar">
          <div className="sidebar-header">
            <h3>Khám Phá Thêm</h3>
            <p>Góc nhìn đa chiều về di sản</p>
          </div>
          <nav className="sidebar-nav">
            <a href="#" className="sidebar-link active">
              <span className="icon">📰</span> Chuyện Nghề
            </a>
            <a href="#" className="sidebar-link">
              <span className="icon">📷</span> Hậu Trường
            </a>
            <a href="#" className="sidebar-link">
              <span className="icon">🤝</span> Đối Tác
            </a>
            <a href="/contact" className="sidebar-link">
              <span className="icon">✉️</span> Góp Ý
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="privacy-main">
          
          {/* Hero Section */}
          <section className="about-hero">
            <div className="about-hero-bg">
              <img src={heroBg} alt="Vietnamese landscape" />
              <div className="hero-overlay-gradient"></div>
            </div>
            <div className="about-hero-content">
              <span className="about-tag">{data.heroSubtitle}</span>
              <h1>
                {data.heroTitle?.split('\n').map((line, i) => (
                  <span key={i}>{line}{i < data.heroTitle.split('\n').length - 1 && <br />}</span>
                ))}
              </h1>
              <p>{data.heroDescription}</p>
            </div>
          </section>

          {/* Brand Story */}
          <section className="about-story">
            <div className="story-text">
              <h2>
                {data.storyTitle?.split('\n').map((line, i) => (
                  <span key={i}>{i === 1 ? <span className="italic-serif">{line}</span> : line}{i < data.storyTitle.split('\n').length - 1 && <br />}</span>
                )) || <>Câu chuyện<br/><span className="italic-serif">Thương hiệu</span></>}
              </h2>
              <p>{data.storyDescription1}</p>
              <p>{data.storyDescription2}</p>
            </div>
            <div className="story-images">
              <div className="img-main">
                <img src={storyImg1} alt="Food illustration" />
              </div>
              <div className="img-stack">
                <img src={storyImg2} alt="Interior arch" className="img-top" />
                <img src={storyImg3} alt="Red building facade" className="img-bottom" />
              </div>
            </div>
          </section>

          {/* Vision & Mission */}
          <section className="about-vision-mission">
            <div className="vm-card">
              <div className="vm-col">
                <h3 className="vm-title"><span className="icon">👁️</span> Tầm Nhìn</h3>
                <p>{data.visionText}</p>
              </div>
              <div className="vm-divider"></div>
              <div className="vm-col">
                <h3 className="vm-title"><span className="icon">✨</span> Sứ Mệnh</h3>
                <ul className="vm-list">
                  {data.missionText1 && <li>{data.missionText1}</li>}
                  {data.missionText2 && <li>{data.missionText2}</li>}
                  {data.missionText3 && <li>{data.missionText3}</li>}
                </ul>
                <div className="vm-circle-decor"></div>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="about-team">
            <div className="team-header">
              <h2>Đội ngũ yêu di sản</h2>
              <p>Những cá nhân cùng chung nhịp đập với giá trị truyền thống</p>
            </div>
            
            <div className="team-grid">
              {/* Member 1 */}
              <div className="team-card">
                <div className="team-img">
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600" alt="Minh Anh" />
                </div>
                <div className="team-info">
                  <h4>Minh Anh</h4>
                  <span>FOUNDER & CREATIVE DIRECTOR</span>
                </div>
              </div>

              {/* Member 2 - staggered */}
              <div className="team-card staggered">
                <div className="team-img">
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600" alt="Thế Nam" />
                </div>
                <div className="team-info">
                  <h4>Thế Nam</h4>
                  <span>GASTRONOMY RESEARCHER</span>
                </div>
              </div>

              {/* Member 3 */}
              <div className="team-card">
                <div className="team-img">
                  <img src="https://images.unsplash.com/photo-1600804889194-e6fbf08ddb39?auto=format&fit=crop&q=80&w=600" alt="Hoàng Duy" />
                </div>
                <div className="team-info">
                  <h4>Hoàng Duy</h4>
                  <span>VISUAL STORYTELLER</span>
                </div>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
};

export default About;
