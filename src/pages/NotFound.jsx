import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="nf-content">
        <h1 className="nf-title">404</h1>
        <h2 className="nf-subtitle">Lạc Đường Rồi!</h2>
        <p className="nf-text">
          Có vẻ như con đường bạn đang tìm kiếm không tồn tại trên bản đồ di sản của chúng tôi. 
          Hoặc trang này đã được di chuyển đến một nơi khác.
        </p>
        
        <Link to="/" className="nf-btn">
          <Home size={18} /> Trở về Trang Chủ
        </Link>
      </div>

      <div className="nf-bg">
        <img src="https://images.unsplash.com/photo-1542013897-40da8bc3257a?auto=format&fit=crop&q=80&w=1200" alt="Vietnamese Landscape" />
        <div className="nf-overlay"></div>
      </div>
    </div>
  );
};

export default NotFound;
