import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Lưu token và thông tin user vào localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Điều hướng dựa trên Role
        if (data.user.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/ctv');
        }
      } else {
        setErrorMsg(data.message || 'Đăng nhập thất bại.');
      }
    } catch (err) {
      console.error('Lỗi login:', err);
      setErrorMsg('Không thể kết nối đến máy chủ.');
    } finally {
      setLoading(false);
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
              <h2>Cổng Thông Tin Quản Trị</h2>
              <p>Hệ thống lưu trữ và lan tỏa các giá trị di sản văn hóa, ẩm thực Việt Nam.</p>
            </div>
            <div className="brand-footer">
              <p>© 2026 Chân Đi Và Nếm. All rights reserved.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="login-form-container">
          <div className="login-form-box">
            <div className="form-header">
              <h3>Đăng Nhập Hệ Thống</h3>
              <p>Vui lòng đăng nhập để tiếp tục công việc của bạn.</p>
            </div>

            {errorMsg && (
              <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="auth-form">
              <div className="auth-group">
                <label>Email đăng nhập</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="admin@example.com" required />
                </div>
              </div>

              <div className="auth-group">
                <div className="label-flex">
                  <label>Mật khẩu</label>
                  <a href="#" className="forgot-link">Quên mật khẩu?</a>
                </div>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
                </div>
              </div>

              <div className="auth-options">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
              </div>

              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? 'Đang xác thực...' : <>Đăng Nhập <ArrowRight size={18} /></>}
              </button>
            </form>

            <div className="auth-divider">
              <span>hoặc</span>
            </div>

            <div className="auth-footer">
              <p>Bạn chưa có tài khoản Cộng tác viên?</p>
              <Link to="/apply-ctv" className="apply-now-link">Đăng ký ngay</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
