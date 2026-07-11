import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Một email chứa liên kết đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn (kể cả thư mục spam).');
        setEmail('');
      } else {
        setError(data.message || 'Gửi yêu cầu thất bại. Vui lòng kiểm tra lại email.');
      }
    } catch (err) {
      console.error('Lỗi quên mật khẩu:', err);
      setError('Lỗi kết nối máy chủ! Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-card">
        <Link to="/login" className="back-link">
          <ArrowLeft size={16} /> Quay lại Đăng nhập
        </Link>
        
        <h2>Quên Mật Khẩu?</h2>
        <p className="forgot-subtitle">
          Nhập địa chỉ email đã đăng ký của bạn bên dưới. Chúng tôi sẽ gửi cho bạn liên kết khôi phục mật khẩu.
        </p>

        {message && <div className="alert success-alert">{message}</div>}
        {error && <div className="alert danger-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="forgot-form">
          <div className="form-group-icon">
            <Mail size={18} className="input-icon" />
            <input 
              type="email" 
              placeholder="Nhập địa chỉ email của bạn..." 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-forgot-submit" disabled={loading}>
            {loading ? 'Đang gửi...' : 'Gửi yêu cầu khôi phục'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
