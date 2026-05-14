import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col-1">
            <span className="footer-logo">CHÂN ĐI VÀ NẾM</span>
            <p className="footer-desc">Khám phá vẻ đẹp tiềm ẩn của Việt Nam thông qua lăng kính văn hóa, ẩm thực và những chuyến đi đầy cảm hứng.</p>
          </div>
          
          <div className="footer-col-2">
            <h4>LIÊN KẾT NHANH</h4>
            <ul className="footer-links">
              <li><a href="#">Về chúng tôi</a></li>
              <li><a href="#">Điểm đến</a></li>
              <li><a href="#">Ẩm thực</a></li>
              <li><a href="#" className="active">Văn hóa</a></li>
            </ul>
          </div>
          
          <div className="footer-col-3">
            <h4>HỖ TRỢ</h4>
            <ul className="footer-links">
              <li><NavLink to="/privacy">Chính sách bảo mật</NavLink></li>
              <li><NavLink to="/contact">Liên hệ</NavLink></li>
              <li><NavLink to="/newsletter">Bản tin</NavLink></li>
            </ul>
          </div>
          
          <div className="footer-col-4">
            <h4>THEO DÕI CHÚNG TÔI</h4>
            <div className="social-icons">
              <a href="#">fb</a>
              <a href="#">ig</a>
              <a href="#">yt</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <span>© 2024 CHÂN ĐI VÀ NẾM. Bảo lưu mọi bản quyền.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
