import React from 'react';
import './NewsletterPage.css';

const NewsletterPage = () => {
  return (
    <div className="newsletter-main-page">
      <div className="privacy-layout">
        
        {/* Sidebar */}
        <aside className="privacy-sidebar">
          <div className="sidebar-header">
            <h3>Khám Phá Thêm</h3>
            <p>Góc nhìn đa chiều về di sản</p>
          </div>
          <nav className="sidebar-nav">
            <a href="#" className="sidebar-link">
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
          <section className="nl-hero">
            <div className="nl-hero-img">
              <img src="https://images.unsplash.com/photo-1544078751-58fee26f4bc7?auto=format&fit=crop&q=80&w=800" alt="Hands crafting" />
            </div>
            <div className="nl-hero-card">
              <span className="nl-tag">CỘNG ĐỒNG DI SẢN</span>
              <h1>Gói ghém hồn Việt vào hộp thư của bạn.</h1>
              <p>Mỗi tháng một lần, chúng tôi gửi đi những câu chuyện chưa kể về làng nghề, công thức món xưa và những nẻo đường di sản ít người đặt chân đến.</p>
              
              <form className="nl-form-box">
                <input type="email" placeholder="Địa chỉ email của bạn" required />
                <button type="submit">Đăng ký nhận bản tin →</button>
              </form>
              <p className="nl-disclaimer">Tham gia cùng 5.000+ người yêu văn hóa. Không spam, có thể hủy bất cứ lúc nào.</p>
            </div>
          </section>

          {/* Archive Section */}
          <section className="archive-section">
            <div className="archive-header">
              <h2>Lưu Trữ Bản Tin</h2>
              <div className="archive-filters">
                <button className="arch-filter active">Tất cả</button>
                <button className="arch-filter">Văn Hóa</button>
                <button className="arch-filter">Ẩm Thực</button>
              </div>
            </div>

            <div className="archive-grid">
              
              {/* Card 1 */}
              <div className="arch-card">
                <div className="arch-img">
                  <img src="https://images.unsplash.com/photo-1583417646194-672589255ce4?auto=format&fit=crop&q=80&w=600" alt="Hội An" />
                  <span className="arch-date-tag">THÁNG 12, 2023</span>
                </div>
                <div className="arch-content">
                  <h3>Những ngọn đèn lồng cuối cùng ở phố Hội</h3>
                  <p>Gặp gỡ nghệ nhân Huỳnh Văn Ba, người đã dành 50 năm giữ lửa cho nghề làm đèn lồng truyền thống...</p>
                  <a href="#" className="read-more">Đọc bản tin ↗</a>
                </div>
              </div>

              {/* Card 2 */}
              <div className="arch-card">
                <div className="arch-img">
                  <img src="https://images.unsplash.com/photo-1628198754117-73b88dcd1e61?auto=format&fit=crop&q=80&w=600" alt="Bản giao hưởng" />
                  <span className="arch-date-tag">THÁNG 11, 2023</span>
                </div>
                <div className="arch-content">
                  <h3>Bản giao hưởng của nước dùng và thảo mộc</h3>
                  <p>Hành trình tìm về nguồn gốc của Phở, từ những gánh hàng rong đầu tiên tại Hà Nội đến món ăn biểu...</p>
                  <a href="#" className="read-more">Đọc bản tin ↗</a>
                </div>
              </div>

              {/* Card 3 - Highlight PDF */}
              <div className="arch-card highlight-card">
                <div className="arch-content">
                  <span className="hl-tag">TIÊU ĐIỂM NĂM</span>
                  <h3>Tuyển tập 12 làng nghề vang bóng một thời</h3>
                  <p>Một ấn phẩm đặc biệt tổng hợp những câu chuyện hay nhất về nghề dệt lụa Vạn Phúc, gốm Bát Tràng và đúc đồng Ý Yên.</p>
                  <button className="btn-download">Tải Xuống PDF (Miễn Phí)</button>
                </div>
                <div className="hl-img">
                  <img src="https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&q=80&w=600" alt="Crafts" />
                </div>
              </div>

              {/* Card 4 */}
              <div className="arch-card">
                <div className="arch-img">
                  <img src="https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&q=80&w=600" alt="Huế" />
                  <span className="arch-date-tag">THÁNG 10, 2023</span>
                </div>
                <div className="arch-content">
                  <h3>Âm hưởng cung đình Huế trong đời sống mới</h3>
                  <p>Khi nhã nhạc và ẩm thực cung đình bước ra khỏi hoàng thành để hòa vào nhịp sống hiện đại của...</p>
                  <a href="#" className="read-more">Đọc bản tin ↗</a>
                </div>
              </div>

              {/* Card 5 */}
              <div className="arch-card">
                <div className="arch-img">
                  <img src="https://images.unsplash.com/photo-1517594422361-5e18d03429ef?auto=format&fit=crop&q=80&w=600" alt="Mù Cang Chải" />
                  <span className="arch-date-tag">THÁNG 09, 2023</span>
                </div>
                <div className="arch-content">
                  <h3>Vàng rực mùa lúa chín vùng cao phía Bắc</h3>
                  <p>Khám phá nét đẹp lao động của người dân tộc H'Mông trên những thửa ruộng bậc thang hùng vĩ Mù...</p>
                  <a href="#" className="read-more">Đọc bản tin ↗</a>
                </div>
              </div>

              {/* Card 6 */}
              <div className="arch-card">
                <div className="arch-img">
                  <img src="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&q=80&w=600" alt="Bếp Việt" />
                  <span className="arch-date-tag">THÁNG 08, 2023</span>
                </div>
                <div className="arch-content">
                  <h3>Gia vị: Linh hồn của bếp Việt</h3>
                  <p>Từ hạt tiêu Phú Quốc đến quế Trà Bồng, những "vàng đen" đã định hình nên bản sắc ẩm thực Việt tr...</p>
                  <a href="#" className="read-more">Đọc bản tin ↗</a>
                </div>
              </div>

            </div>

            {/* Pagination */}
            <div className="nl-pagination">
              <button className="nl-page-btn">‹</button>
              <div className="nl-page-numbers">
                <span className="current">01</span> <span className="separator">/</span> <span className="total">08</span>
              </div>
              <button className="nl-page-btn">›</button>
            </div>

          </section>

        </main>
      </div>
    </div>
  );
};

export default NewsletterPage;
