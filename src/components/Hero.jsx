import React from 'react';

const Hero = () => {
  return (
    <section className="hero" style={{backgroundImage: "url('https://images.unsplash.com/photo-1542013897-40da8bc3257a?auto=format&fit=crop&q=80&w=2000')"}}>
      <div className="container">
        <div className="hero-content">
          <span className="hero-tag">DI SẢN VĂN HÓA</span>
          <h1>Tinh hoa văn hóa<br/>Việt</h1>
          <p>Mỗi một di sản về thế giới tâm linh, từ những làng nghề nghìn năm tuổi những nụ cười thuần hậu tạo nên vẻ đẹp rất riêng biệt.</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
