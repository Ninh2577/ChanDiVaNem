import React from 'react';
import './About.css';

const About = () => {
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
              <img src="https://images.unsplash.com/photo-1542013897-40da8bc3257a?auto=format&fit=crop&q=80&w=1200" alt="Vietnamese landscape" />
              <div className="hero-overlay-gradient"></div>
            </div>
            <div className="about-hero-content">
              <span className="about-tag">HÀNH TRÌNH TÂM HỒN</span>
              <h1>Gìn giữ hồn<br/>Việt qua từng<br/>bước chân.</h1>
              <p>Chúng tôi không chỉ kể chuyện. Chúng tôi lưu trữ những giá trị hữu hình và vô hình của một Việt Nam rực rỡ.</p>
            </div>
          </section>

          {/* Brand Story */}
          <section className="about-story">
            <div className="story-text">
              <h2>Câu chuyện<br/><span className="italic-serif">Thương hiệu</span></h2>
              <p>Bắt đầu từ niềm đam mê bất tận với những cung đường vắt ngang đồi chè và hương vị mộc mạc của gánh hàng rong ven đô, <strong>CHÂN ĐI VÀ NẾM</strong> ra đời như một cuốn nhật ký sống động.</p>
              <p>Chúng tôi tin rằng văn hóa không nằm trong bảo tàng; nó nằm trong cách một nghệ nhân nâng niu thớ lụa, cách một bà cụ nêm nếm bát phở sáng, và cách người trẻ tìm về nguồn cội bằng góc nhìn đương đại.</p>
            </div>
            <div className="story-images">
              <div className="img-main">
                <img src="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&q=80&w=600" alt="Food illustration" />
              </div>
              <div className="img-stack">
                <img src="https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&q=80&w=600" alt="Interior arch" className="img-top" />
                <img src="https://images.unsplash.com/photo-1583417646194-672589255ce4?auto=format&fit=crop&q=80&w=600" alt="Red building facade" className="img-bottom" />
              </div>
            </div>
          </section>

          {/* Vision & Mission */}
          <section className="about-vision-mission">
            <div className="vm-card">
              <div className="vm-col">
                <h3 className="vm-title"><span className="icon">👁️</span> Tầm Nhìn</h3>
                <p>Trở thành nền tảng truyền thông di sản hàng đầu, đưa vẻ đẹp đích thực của Việt Nam đến với cộng đồng quốc tế thông qua những trải nghiệm thị giác và nội dung có chiều sâu nghệ thuật.</p>
              </div>
              <div className="vm-divider"></div>
              <div className="vm-col">
                <h3 className="vm-title"><span className="icon">✨</span> Sứ Mệnh</h3>
                <ul className="vm-list">
                  <li>Quảng bá văn hóa & ẩm thực bền vững.</li>
                  <li>Hỗ trợ cộng đồng nghệ nhân địa phương.</li>
                  <li>Tạo ra hệ sinh thái du lịch văn hóa tử tế.</li>
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
