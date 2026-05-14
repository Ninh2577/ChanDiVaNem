import React from 'react';

const Festivals = () => {
  return (
    <section className="festivals">
      <div className="container">
        <div className="section-header-row">
          <div>
            <h2>Lịch lễ hội</h2>
            <p className="subtitle-text">Mỗi dịp xuân về, hay khi thu sang, đất Việt lại rộn ràng trong tiếng trống hội. Những nghi lễ truyền thống được gìn giữ qua bao thế hệ.</p>
          </div>
          <div className="slider-nav">
            <button className="slider-btn prev">←</button>
            <button className="slider-btn next">→</button>
          </div>
        </div>
        
        <div className="festivals-grid">
          <div className="festival-card">
            <div className="fest-num">01</div>
            <h3>Tết Nguyên Đán</h3>
            <p>Lễ hội lớn nhất năm, thể hiện sự đoàn viên, biết ơn tổ tiên của dân Việt Nam.</p>
            <a href="#" className="location-link"><span>📍</span> Toàn quốc</a>
          </div>
          <div className="festival-card">
            <div className="fest-num">02</div>
            <h3>Lễ hội Chùa Hương</h3>
            <p>Hành trình về miền đất Phật, chiêm bái cảnh sắc thiên nhiên hùng vĩ tại Mỹ Đức.</p>
            <a href="#" className="location-link"><span>📍</span> Hà Nội</a>
          </div>
          <div className="festival-card">
            <div className="fest-num">03</div>
            <h3>Giỗ Tổ Hùng Vương</h3>
            <p>Ngày hội tưởng nhớ nguồn cội dân tộc của đất Việt "Con Rồng cháu Tiên".</p>
            <a href="#" className="location-link"><span>📍</span> Phú Thọ</a>
          </div>
          <div className="festival-card">
            <div className="fest-num">04</div>
            <h3>Festival Huế</h3>
            <p>Tôn vinh các giá trị di sản nghệ thuật, tôn vinh truyền thống dân tộc.</p>
            <a href="#" className="location-link"><span>📍</span> Thừa Thiên Huế</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Festivals;
