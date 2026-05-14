import React from 'react';
import Newsletter from '../components/Newsletter';
import './Destinations.css';

const Destinations = () => {
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
                <button className="filter-btn active">Tất cả điểm đến <span>›</span></button>
                <button className="filter-btn">Miền Bắc <span>›</span></button>
                <button className="filter-btn">Miền Trung <span>›</span></button>
                <button className="filter-btn">Miền Nam <span>›</span></button>
              </div>
              
              <div className="search-box-wrap">
                <span className="search-label">TÌM KIẾM ĐỊA DANH</span>
                <div className="search-input-container">
                  <input type="text" placeholder="Hà Giang, Hội An..." />
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
                <p>Nhấp vào các điểm trên bản đồ để khám phá những câu chuyện ẩn giấu đằng sau mỗi di sản lịch sử và thiên nhiên.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header-row">
            <h2>Các điểm đến nổi bật</h2>
            <a href="#" className="view-all-link">Xem tất cả (42) →</a>
          </div>
          
          <div className="featured-grid">
            {/* Large Card */}
            <div className="feat-card feat-large">
              <img src="https://images.unsplash.com/photo-1542013897-40da8bc3257a?auto=format&fit=crop&q=80&w=1000" alt="Hà Giang" />
              <div className="feat-content-overlay">
                <span className="feat-tag">MIỀN BẮC</span>
                <h3>Hà Giang: Bản hùng ca từ đá</h3>
                <p>Nơi những con đường uốn lượn qua cao nguyên đá Đồng Văn, mở ra khung cảnh hùng vĩ của biên cương Tổ quốc và những nụ cười vùng cao.</p>
                <button className="btn-primary">Khám phá ngay</button>
              </div>
            </div>
            
            {/* Standard Card 1 */}
            <div className="feat-card">
              <img src="https://images.unsplash.com/photo-1583417646194-672589255ce4?auto=format&fit=crop&q=80&w=600" alt="Hội An" />
              <div className="feat-content">
                <span className="feat-tag">MIỀN TRUNG</span>
                <h3>Hội An: Hoài niệm phố hội</h3>
                <p>Lạc bước trong những con ngõ nhỏ nhuốm màu thời gian, nơi ánh đèn lồng rực rỡ soi bóng xuống dòng sông Hoài.</p>
              </div>
            </div>
            
            {/* Standard Card 2 */}
            <div className="feat-card">
              <img src="https://images.unsplash.com/photo-1628198754117-73b88dcd1e61?auto=format&fit=crop&q=80&w=600" alt="Phú Quốc" />
              <div className="feat-content">
                <span className="feat-tag">MIỀN NAM</span>
                <h3>Phú Quốc: Đảo ngọc thiên đường</h3>
              </div>
            </div>
            
            {/* Standard Card 3 */}
            <div className="feat-card">
              <img src="https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&q=80&w=600" alt="Cố đô Huế" />
              <div className="feat-content">
                <span className="feat-tag">MIỀN TRUNG</span>
                <h3>Cố đô Huế: Vẻ đẹp trầm mặc</h3>
              </div>
            </div>
            
            {/* Standard Card 4 */}
            <div className="feat-card">
              <img src="https://images.unsplash.com/photo-1600007283728-22aba3e1d6d8?auto=format&fit=crop&q=80&w=600" alt="Ninh Bình" />
              <div className="feat-content">
                <span className="feat-tag">MIỀN BẮC</span>
                <h3>Ninh Bình: Hạ Long trên cạn</h3>
              </div>
            </div>
          </div>
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
