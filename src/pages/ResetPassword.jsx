import React, { useState, useEffect } from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import './ResetPassword.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Token đặt lại mật khẩu bị thiếu hoặc không hợp lệ. Vui lòng thử lại.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    if (password.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, password })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Đặt lại mật khẩu thành công! Trực tiếp chuyển hướng về trang đăng nhập sau 3 giây...');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error('Lỗi đặt lại mật khẩu:', err);
      setError('Lỗi kết nối máy chủ! Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-card">
        <Link to="/login" className="back-link">
          <ArrowLeft size={16} /> Quay lại Đăng nhập
        </Link>
        
        <h2>Đặt Lại Mật Khẩu</h2>
        <p className="reset-subtitle">
          Nhập mật khẩu mới bên dưới để hoàn tất quá trình khôi phục tài khoản.
        </p>

        {message && <div className="alert success-alert">{message}</div>}
        {error && <div className="alert danger-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="reset-form">
          <div className="form-group-icon">
            <Lock size={18} className="input-icon" />
            <input 
              type="password" 
              placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)..." 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading || !token}
            />
          </div>

          <div className="form-group-icon">
            <Lock size={18} className="input-icon" />
            <input 
              type="password" 
              placeholder="Xác nhận lại mật khẩu mới..." 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading || !token}
            />
          </div>

          <button type="submit" className="btn-reset-submit" disabled={loading || !token}>
            {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
