import React from 'react';
import './Cuisine.css';

const Cuisine = () => {
  return (
    <div className="cuisine-page">
      {/* Hero Section */}
      <section className="cuisine-hero" style={{backgroundImage: "url('https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&q=80&w=2000')"}}>
        <div className="container">
          <div className="cuisine-hero-card">
            <span className="section-subtitle">HÀNH TRÌNH ẨM THỰC</span>
            <h1>Hương vị hồn Việt</h1>
            <p>Khám phá di sản tinh túy qua từng món ăn, từ những gánh hàng rong ven đường đến những bữa tiệc cung đình trang trọng.</p>
            <button className="btn-primary">Khám phá ngay</button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="cuisine-categories">
        <div className="container">
          <div className="cat-grid">
            <div className="cat-card">
              <img src="https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&q=80&w=400" alt="Món nước" />
              <div className="cat-overlay">
                <h3>Món nước</h3>
                <p>Phở, Bún bò, Hủ tiếu</p>
              </div>
            </div>
            <div className="cat-card">
              <img src="https://images.unsplash.com/photo-1628198754117-73b88dcd1e61?auto=format&fit=crop&q=80&w=400" alt="Món khô" />
              <div className="cat-overlay">
                <h3>Món khô</h3>
                <p>Cơm tấm, Bánh mì, Bún xèo</p>
              </div>
            </div>
            <div className="cat-card">
              <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400" alt="Quà vặt" />
              <div className="cat-overlay">
                <h3>Quà vặt</h3>
                <p>Chè, Bánh tráng, Gỏi cuốn</p>
              </div>
            </div>
            <div className="cat-card">
              <img src="https://images.unsplash.com/photo-1538587888044-79f13ddd7e49?auto=format&fit=crop&q=80&w=400" alt="Cà phê Việt" />
              <div className="cat-overlay">
                <h3>Cà phê Việt</h3>
                <p>Đen, Trứng, Muối</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Dishes (Zig-zag) */}
      <section className="featured-dishes">
        <div className="container">
          
          <div className="dish-row">
            <div className="dish-image">
              <img src="https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&q=80&w=800" alt="Bún Chả" />
            </div>
            <div className="dish-content">
              <span className="section-subtitle">MÓN KHÔ - ĐẶC SẢN THỦ ĐÔ</span>
              <h2>Bún Chả: Diệu vũ của khói và thịt nướng</h2>
              <p>Hà Nội là những con ngõ nhỏ của Hà Nội cổ kính. Bún chả không chỉ là một món ăn, mà là một trải nghiệm giác quan. Những miếng chả băm và chả miếng được nướng cháy xém cạnh trên than hồng, quyện cùng nước mắm chua ngọt thanh tao.</p>
              
              <div className="location-box">
                <div className="loc-title"><span>📍</span> Nơi thưởng thức ngon nhất</div>
                <p>Bún chả Hương Liên (Ngô Thì Nhậm) hoặc các quán gánh vỉa hè phố cổ Hà Nội.</p>
              </div>
            </div>
          </div>

          <div className="dish-row reverse">
            <div className="dish-content">
              <span className="section-subtitle">MÓN NƯỚC - QUỐC HỒN QUỐC TÚY</span>
              <h2>Phở: Tinh hoa trong từng giọt nước dùng</h2>
              <p>Phở là linh hồn ẩm thực của người Việt. Nước dùng phở mang đậm đà, được ninh từ xương ống suốt hàng chục giờ cùng với quế, hồi, gừng nướng và thảo quả, tạo nên một hương vị mê đắm khó quên.</p>
              
              <div className="location-box">
                <div className="loc-title"><span>📍</span> Nơi thưởng thức ngon nhất</div>
                <p>Phở Thìn Lò Đúc (Hà Nội) hoặc Phở Hòa (TP. Hồ Chí Minh).</p>
              </div>
            </div>
            <div className="dish-image">
              <img src="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&q=80&w=800" alt="Phở" />
            </div>
          </div>

        </div>
      </section>

      {/* Experience Section */}
      <section className="experience-section">
        <div className="container">
          <div className="text-center">
            <span className="section-subtitle">HỌC & TRẢI NGHIỆM</span>
            <h2>Trải nghiệm bếp Việt</h2>
          </div>
          
          <div className="bento-grid">
            {/* Top Left - Large */}
            <div className="bento-card bento-large-tl">
              <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1000" alt="Khóa học nấu ăn" />
              <div className="bento-overlay">
                <h3>Khóa học Nấu ăn Nghệ nhân</h3>
                <p>Học nấu ăn dưới sự hướng dẫn của nghệ nhân ẩm thực Việt Nam, trải nghiệm văn hóa ẩm thực tại Hội An.</p>
                <button className="btn-white">Đặt chỗ ngay</button>
              </div>
            </div>
            
            {/* Top Right - Small */}
            <div className="bento-card bento-small-tr bento-light">
              <div className="bento-content">
                <span className="bento-icon">🚶</span>
                <h3>Street Food Tour</h3>
                <p>Khám phá những viên ngọc ẩn giấu trong hẻm nhỏ Sài Gòn cùng hướng dẫn viên bản địa.</p>
                <a href="#" className="link-primary" style={{marginTop: 'auto'}}>Xem lịch trình →</a>
              </div>
            </div>
            
            {/* Bottom Left - Small */}
            <div className="bento-card bento-small-bl bento-brown">
              <div className="bento-content">
                <span className="bento-icon">☕</span>
                <h3 style={{color: 'white'}}>Hành trình Cà phê</h3>
                <p style={{color: 'rgba(255,255,255,0.8)'}}>Từ đồn điền Buôn Ma Thuột đến những ly cà phê muối độc đáo tại Huế.</p>
                <a href="#" style={{color: 'white', fontWeight: 600, marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>Tìm hiểu thêm →</a>
              </div>
            </div>
            
            {/* Bottom Right - Large */}
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
