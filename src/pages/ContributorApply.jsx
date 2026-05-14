import React, { useState } from 'react';
import './ContributorApply.css';

const ContributorApply = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    portfolioLink: '',
    favoriteCategory: '',
    experience: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Đơn ứng tuyển của bạn đã được gửi thành công! Quản trị viên sẽ phản hồi sớm.' });
        // Xóa form sau khi gửi thành công
        setFormData({
          fullName: '', phone: '', email: '', portfolioLink: '', favoriteCategory: '', experience: ''
        });
      } else {
        setMessage({ type: 'error', text: data.message || 'Gửi đơn thất bại.' });
      }
    } catch (error) {
      console.error('Lỗi khi gửi đơn:', error);
      setMessage({ type: 'error', text: 'Lỗi kết nối máy chủ.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ctv-apply-page">
      {/* Hero Section */}
      <section className="ctv-hero">
        <div className="ctv-container">
          <div className="ctv-hero-content">
            <span className="ctv-tag">CỘNG TÁC CÙNG CHÚNG TÔI</span>
            <h1>Trở thành một phần của hành trình lưu giữ di sản</h1>
            <p>Lan tỏa những câu chuyện văn hóa, ẩm thực và điểm đến tuyệt vời qua góc nhìn độc đáo của chính bạn.</p>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="ctv-form-section">
        <div className="ctv-container ctv-split">
          
          <div className="ctv-info-side">
            <h2>Tại sao nên đồng hành cùng CHÂN ĐI VÀ NẾM?</h2>
            <div className="benefit-item">
              <span className="benefit-icon">💡</span>
              <div>
                <h3>Tự do sáng tạo</h3>
                <p>Không giới hạn góc nhìn, chúng tôi tôn trọng câu chuyện cá nhân và văn phong của bạn.</p>
              </div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🌍</span>
              <div>
                <h3>Lan tỏa giá trị</h3>
                <p>Bài viết của bạn sẽ tiếp cận hàng nghìn độc giả yêu văn hóa Việt Nam cả trong và ngoài nước.</p>
              </div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🤝</span>
              <div>
                <h3>Kết nối cộng đồng</h3>
                <p>Trở thành một thành viên trong mạng lưới những người kể chuyện, nhà nghiên cứu văn hóa đa dạng.</p>
              </div>
            </div>
          </div>

          <div className="ctv-form-side">
            <div className="ctv-form-card">
              <h3>Đơn Ứng Tuyển Cộng Tác Viên</h3>
              <p className="form-subtitle">Hãy điền đầy đủ thông tin bên dưới để chúng tôi hiểu hơn về bạn.</p>
              
              {message && (
                <div className={`form-message ${message.type}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="apply-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>HỌ VÀ TÊN</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Nguyễn Văn A" required />
                  </div>
                  <div className="form-group">
                    <label>SỐ ĐIỆN THOẠI</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="090 123 4567" required />
                  </div>
                </div>

                <div className="form-group">
                  <label>EMAIL</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@email.com" required />
                </div>

                <div className="form-group">
                  <label>LIÊN KẾT HỒ SƠ / CV / PORTFOLIO</label>
                  <input type="url" name="portfolioLink" value={formData.portfolioLink} onChange={handleChange} placeholder="https://link-to-your-cv-or-portfolio.com" required />
                  <span className="input-hint">Có thể là link Google Drive, LinkedIn hoặc Website cá nhân.</span>
                </div>

                <div className="form-group">
                  <label>CHUYÊN MỤC YÊU THÍCH</label>
                  <div className="select-wrapper">
                    <select name="favoriteCategory" value={formData.favoriteCategory} onChange={handleChange} required>
                      <option value="" disabled>Chọn chuyên mục bạn muốn viết...</option>
                      <option value="Khám phá Văn Hóa">Khám phá Văn Hóa</option>
                      <option value="Review Ẩm Thực">Review Ẩm Thực</option>
                      <option value="Trải nghiệm Điểm Đến">Trải nghiệm Điểm Đến</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>KINH NGHIỆM VÀ ĐỊNH HƯỚNG CỦA BẠN</label>
                  <textarea name="experience" value={formData.experience} onChange={handleChange} rows="5" placeholder="Chia sẻ một chút về kinh nghiệm viết lách hoặc đam mê văn hóa của bạn..." required></textarea>
                </div>

                <button type="submit" className="btn-submit-apply" disabled={loading}>
                  {loading ? 'Đang gửi...' : 'Gửi Đơn Ứng Tuyển'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ContributorApply;
