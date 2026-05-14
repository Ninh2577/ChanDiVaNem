import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import './Login.css'; // Reusing Login styles for consistency

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/login');
      } else {
        setError(data.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } catch {
      setError('Không thể kết nối đến máy chủ Backend. Vui lòng đảm bảo Server đang chạy.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-split">
        {/* Left Side: Branding / Image */}
        <div className="login-brand">
          <div className="brand-overlay">
            <Link to="/" className="brand-logo">CHÂN ĐI VÀ NẾM</Link>
            <div className="brand-text">
              <h2>Trở Thành Độc Giả</h2>
              <p>Tham gia cộng đồng để bình luận, đánh giá và lưu trữ những bài viết văn hóa đặc sắc.</p>
            </div>
            <div className="brand-footer">
              <p>© 2026 Chân Đi Và Nếm. All rights reserved.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="login-form-container">
          <div className="login-form-box" style={{marginTop: '2rem'}}>
            <div className="form-header">
              <h3>Đăng Ký Tài Khoản</h3>
              <p>Tạo tài khoản mới để tương tác với các bài viết.</p>
            </div>

            {error && <div className="auth-error-msg" style={{color: '#ef4444', marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fee2e2', borderRadius: '6px', fontSize: '0.9rem'}}>{error}</div>}

            <form onSubmit={handleRegister} className="auth-form">
              <div className="auth-group">
                <label>Họ và Tên</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input type="text" name="fullName" placeholder="Nguyễn Văn A" required onChange={handleChange} />
                </div>
              </div>

              <div className="auth-group">
                <label>Email đăng ký</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input type="email" name="email" placeholder="example@email.com" required onChange={handleChange} />
                </div>
              </div>

              <div className="auth-group">
                <label>Mật khẩu</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input type="password" name="password" placeholder="••••••••" required onChange={handleChange} />
                </div>
              </div>

              <div className="auth-group">
                <label>Xác nhận mật khẩu</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input type="password" name="confirmPassword" placeholder="••••••••" required onChange={handleChange} />
                </div>
              </div>

              <button type="submit" className="btn-login" disabled={isLoading}>
                {isLoading ? 'Đang xử lý...' : 'Đăng Ký'} <ArrowRight size={18} />
              </button>
            </form>

            <div className="auth-divider">
              <span>hoặc</span>
            </div>

            <div className="auth-footer">
              <p>Bạn đã có tài khoản?</p>
              <Link to="/login" className="apply-now-link">Đăng nhập ngay</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
