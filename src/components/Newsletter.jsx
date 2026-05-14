import React from 'react';
import './Newsletter.css';

const Newsletter = ({ 
  title = "Nhận tin bài mới nhất về Văn hóa", 
  description = "Đăng ký để không bỏ lỡ những câu chuyện đặc sắc về di sản Việt Nam.",
  placeholder = "Email của bạn",
  buttonText = "Đăng ký",
  theme = "primary"
}) => {
  return (
    <section className={`newsletter-section theme-${theme}`}>
      <div className="container">
        <div className="newsletter-box">
          <h2>{title}</h2>
          <p>{description}</p>
          <form className="newsletter-form-inline">
            <input type="email" placeholder={placeholder} required />
            <button type="submit">{buttonText}</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
