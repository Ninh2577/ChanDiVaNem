import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  const [activeTab, setActiveTab] = useState('about'); // 'about', 'stories', 'behind', 'partners'

  useEffect(() => {
    // Tối ưu SEO cho trang Về chúng tôi
    document.title = "Về chúng tôi - Sứ mệnh Chân Đi Và Nếm | Chân Đi Và Nếm";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Tìm hiểu về lịch sử hình thành, tầm nhìn chiến lược và sứ mệnh bảo tồn, lan tỏa các giá trị văn hóa nghệ thuật Việt Nam của chúng tôi.";

    fetch(`${API}/api/site-content/page_about`)
      .then(res => res.ok ? res.json() : null)
      .then(resData => {
        if (resData) {
          setData(prev => ({ ...prev, ...resData }));
        }
      })
      .catch(() => console.warn('Sử dụng dữ liệu Giới thiệu mặc định.'));
  }, []);

  const heroBg = data.heroImageUrl ? `${API}${data.heroImageUrl}` : `${API}/public/images/taybac.png`;
  const storyImg1 = data.storyImageUrl1 ? `${API}${data.storyImageUrl1}` : `${API}/public/images/taxua.png`;
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
            <button 
              className={`sidebar-link ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              <span className="icon">🏛️</span> Giới Thiệu
            </button>
            <button 
              className={`sidebar-link ${activeTab === 'stories' ? 'active' : ''}`}
              onClick={() => setActiveTab('stories')}
            >
              <span className="icon">📰</span> Chuyện Nghề
            </button>
            <button 
              className={`sidebar-link ${activeTab === 'behind' ? 'active' : ''}`}
              onClick={() => setActiveTab('behind')}
            >
              <span className="icon">📷</span> Hậu Trường
            </button>
            <button 
              className={`sidebar-link ${activeTab === 'partners' ? 'active' : ''}`}
              onClick={() => setActiveTab('partners')}
            >
              <span className="icon">🤝</span> Đối Tác
            </button>
            <Link to="/contact" className="sidebar-link">
              <span className="icon">✉️</span> Góp Ý
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="privacy-main">
          
          {/* Tab 1: Giới thiệu chung */}
          {activeTab === 'about' && (
            <>
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

              {/* Founder Section */}
              <section className="about-founder">
                <div className="founder-container">
                  <div className="founder-image-wrapper">
                    <div className="founder-image-bg-decor"></div>
                    <img 
                      src={`${API}/brain/e2fc110a-93fa-4bd0-92ac-bdcf09cc2b8b/media__1783859396174.jpg`} 
                      alt="Nguyễn Hoàng Ninh" 
                      className="founder-image"
                    />
                  </div>
                  <div className="founder-info">
                    <span className="founder-subtitle">NHÀ SÁNG LẬP & PHÁT TRIỂN DỰ ÁN</span>
                    <h2 className="founder-name">Nguyễn Hoàng Ninh</h2>
                    <span className="founder-role">Full-stack Developer & Heritage Enthusiast</span>
                    
                    <p className="founder-bio">
                      Là người duy nhất đứng sau sự phát triển toàn diện của dự án <strong>Chân Đi và Nếm</strong>, Hoàng Ninh mang trong mình sự kết hợp độc đáo giữa tư duy logic của một nhà phát triển công nghệ và trái tim nhạy cảm dành cho các giá trị văn hóa truyền thống Việt Nam. 
                    </p>
                    <p className="founder-bio">
                      Bằng việc tự tay thiết kế giao diện, tối ưu hóa cơ sở dữ liệu và xây dựng hệ thống quản trị, Hoàng Ninh khát khao đưa <strong>Chân Đi và Nếm</strong> trở thành một thư viện số sống động - nơi mỗi món ăn, mỗi điểm đến được lưu giữ bằng tình yêu di sản và chia sẻ rộng rãi đến bạn bè bốn phương.
                    </p>
                    
                    <div className="founder-details-grid">
                      <div className="detail-item">
                        <span className="detail-label">Lĩnh vực chuyên môn</span>
                        <span className="detail-value">Lập trình Full-Stack, UI/UX Design, Số hóa Di sản</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Liên hệ trực tiếp</span>
                        <a href="tel:0396782577" className="detail-value highlight">📞 039.678.2577</a>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Mạng xã hội</span>
                        <a 
                          href="https://www.facebook.com/ninh.nguyen.99498" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="detail-value highlight fb-link"
                        >
                          🔵 Facebook cá nhân
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Tab 2: Chuyện Nghề */}
          {activeTab === 'stories' && (
            <section className="about-tab-section dynamic-fade-in">
              <div className="tab-section-header">
                <span className="tab-badge">KÝ SỰ ĐƯỜNG DÀI</span>
                <h2>Chuyện Nghề & Hành Trình Ghi Chép</h2>
                <p>Những trang nhật ký hành trình ghi nhận giá trị văn hóa nghệ thuật truyền thống của đồng bào Việt.</p>
              </div>

              <div className="stories-editorial-grid">
                <div className="editorial-card">
                  <div className="editorial-img">
                    <img src="https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=800" alt="Gốm Bát Tràng" />
                  </div>
                  <div className="editorial-content">
                    <span className="edit-tag">DI SẢN ĐẤT NUNG</span>
                    <h3>Gốm Bát Tràng - Men Lam Qua Ngàn Năm Lửa Đỏ</h3>
                    <p>Hành trình tìm về những xưởng gốm cổ kính nép mình bên dòng sông Hồng, nơi đất sét thô sơ được thổi hồn bởi đôi bàn tay tài hoa của các nghệ nhân gạo cội. Lớp men lam bóng bẩy, những hoa văn phác họa nét xưa thời Lý - Trần không chỉ là sản phẩm mỹ nghệ, mà còn là linh hồn ngàn năm lưu truyền của một vùng đất cổ.</p>
                  </div>
                </div>

                <div className="editorial-card">
                  <div className="editorial-img">
                    <img src="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&q=80&w=800" alt="Phở gánh" />
                  </div>
                  <div className="editorial-content">
                    <span className="edit-tag">ẨM THỰC KÝ</span>
                    <h3>Hương Vị Phở Gánh Hàng Chiếu Lúc Nửa Đêm</h3>
                    <p>Có những thức quà chỉ ngon nhất khi đêm về. Dưới ánh đèn dầu leo lét phố cổ Hà Nội, nồi nước dùng ninh xương bò nghi ngút khói tỏa hương thơm thoang thoảng của gừng nướng, thảo quả và đại hồi. Một bát phở gánh ấm áp giữa đêm lạnh giúp giữ lại trọn vẹn nét ẩm thực bình dị mà thanh lịch của đất Tràng An xưa.</p>
                  </div>
                </div>

                <div className="editorial-card">
                  <div className="editorial-img">
                    <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800" alt="Đèn lồng Hội An" />
                  </div>
                  <div className="editorial-content">
                    <span className="edit-tag">LÀNG NGHỀ CỔ KÍNH</span>
                    <h3>Đèn Lồng Hội An - Ánh Sáng Hoài Niệm Nơi Phố Cổ</h3>
                    <p>Gặp gỡ nghệ nhân thắp lửa đêm Hội An, nghe kể câu chuyện thầm lặng chuốt từng thanh tre, căng từng thớ lụa tơ tằm mềm mại. Mỗi chiếc đèn lồng treo trên mái hiên rêu phong của phố Hoài cổ kính chính là biểu tượng tinh thần, là nhân chứng cho dòng chảy văn hóa phồn thịnh hàng thế kỷ của thương cảng xưa.</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Tab 3: Hậu Trường */}
          {activeTab === 'behind' && (
            <section className="about-tab-section dynamic-fade-in">
              <div className="tab-section-header">
                <span className="tab-badge">NHẬT KÝ SAU ỐNG KÍNH</span>
                <h2>Ghi Chép Hiện Trường</h2>
                <p>Những hình ảnh chân thực ghi lại quá trình săn ảnh, thu âm và tiếp xúc với người dân bản địa khắp nẻo đường Việt Nam.</p>
              </div>

              <div className="behind-gallery-grid">
                <div className="gallery-item">
                  <div className="gallery-img">
                    <img src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=800" alt="Mu Cang Chai" />
                  </div>
                  <div className="gallery-caption">
                    <h4>Đợi Bình Minh Trên Đèo Khau Phạ</h4>
                    <p>Để ghi nhận trọn vẹn thung lũng lúa Cao Phạ bồng bềnh trong làn sương sớm, chúng tôi đã phải có mặt từ lúc 4h30 sáng trong cái lạnh 12 độ của miền biên viễn, giữ máy ảnh ổn định trước sức gió mạnh mẽ trên đỉnh đèo.</p>
                  </div>
                </div>

                <div className="gallery-item">
                  <div className="gallery-img">
                    <img src="https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&q=80&w=800" alt="Kitchen fire" />
                  </div>
                  <div className="gallery-caption">
                    <h4>Bếp Lửa Hồng Dao Đỏ Ở Tả Phìn</h4>
                    <p>Đêm giao lưu bên chảo thắng cố nghi ngút khói và những câu chuyện ấm áp tình người của đồng bào dân tộc thiểu số tại Sa Pa. Khói bếp củi hun hút nồng nàn cay xè mắt nhưng chan chứa nghĩa tình bản cao.</p>
                  </div>
                </div>

                <div className="gallery-item">
                  <div className="gallery-img">
                    <img src="https://images.unsplash.com/photo-1583417646194-672589255ce4?auto=format&fit=crop&q=80&w=800" alt="Ancient bells" />
                  </div>
                  <div className="gallery-caption">
                    <h4>Thu Âm Tiếng Chuông Khánh Chùa Cổ</h4>
                    <p>Ghi âm âm thanh mộc mạc của tiếng chuông chùa Keo giữa buổi chiều hoàng hôn tĩnh lặng, mang lại một liều thuốc thanh lọc tâm hồn yên ả phục vụ độc giả của Chân Đi và Nếm.</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Tab 4: Đối Tác */}
          {activeTab === 'partners' && (
            <section className="about-tab-section dynamic-fade-in">
              <div className="tab-section-header">
                <span className="tab-badge">MẠNG LƯỚI LIÊN KẾT</span>
                <h2>Cộng Đồng Đồng Hành & Đối Tác Bản Địa</h2>
                <p>Chúng tôi vinh dự được hợp tác cùng các hiệp hội ẩm thực, tổ chức bảo tồn và những người làm du lịch bản địa tử tế.</p>
              </div>

              <div className="partners-grid-layout">
                <div className="partner-item-card">
                  <div className="partner-logo-box">🤝</div>
                  <h3>Hiệp Hội Ẩm Thực Truyền Thống Việt Nam</h3>
                  <p>Hỗ trợ nghiên cứu, tư liệu hóa và bảo trợ thông tin chuyên môn lịch sử ẩm thực cho dự án.</p>
                </div>

                <div className="partner-item-card">
                  <div className="partner-logo-box">🍃</div>
                  <h3>Hợp Tác Xã Trà San Tuyết Suối Giàng</h3>
                  <p>Bảo tồn cây trà cổ thụ và quảng bá nghi thức trà đạo của người Mông vùng cao Yên Bái.</p>
                </div>

                <div className="partner-item-card">
                  <div className="partner-logo-box">🏘️</div>
                  <h3>Cộng Đồng Homestay Bản Địa Tây Bắc</h3>
                  <p>Liên kết cung cấp dịch vụ trải nghiệm lưu trú văn hóa đích thực của người dân địa phương dành cho du khách.</p>
                </div>

                <div className="partner-item-card">
                  <div className="partner-logo-box">🏺</div>
                  <h3>Hội Nghệ Nhân Gốm Cổ Bát Tràng</h3>
                  <p>Hỗ trợ không gian thực nghiệm thủ công mỹ nghệ cổ và cung cấp kiến thức phục chế màu men cổ.</p>
                </div>
              </div>
            </section>
          )}

        </main>
      </div>
    </div>
  );
};

export default About;
