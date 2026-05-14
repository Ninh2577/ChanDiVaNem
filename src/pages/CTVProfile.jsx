import React from 'react';
import { Camera, Save, Lock, User, Mail, Phone, Link2 } from 'lucide-react';
import './CTVProfile.css';

const CTVProfile = () => {
  const handleSave = (e) => {
    e.preventDefault();
    alert('Đã cập nhật hồ sơ thành công!');
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Hồ Sơ Cá Nhân</h1>
          <p>Quản lý thông tin cá nhân và thiết lập tài khoản của bạn.</p>
        </div>
        <button className="btn-primary" style={{ backgroundColor: '#10b981' }} onClick={handleSave}>
          <Save size={18} /> Lưu thay đổi
        </button>
      </div>

      <div className="profile-layout">
        {/* Left Col: Avatar & Basic Info */}
        <div className="profile-sidebar">
          <div className="admin-card profile-card-main">
            <div className="avatar-section">
              <div className="avatar-wrapper">
                <img src="https://ui-avatars.com/api/?name=C+T+V&background=047857&color=fff&size=150" alt="Avatar" className="profile-avatar" />
                <button className="avatar-upload-btn">
                  <Camera size={16} />
                </button>
              </div>
              <h3 className="profile-name-large">Cộng Tác Viên 01</h3>
              <span className="profile-role-badge">Tác giả độc lập</span>
            </div>
            
            <div className="profile-stats">
              <div className="p-stat">
                <span className="p-stat-val">4</span>
                <span className="p-stat-lbl">Bài viết</span>
              </div>
              <div className="p-stat">
                <span className="p-stat-val">4.6K</span>
                <span className="p-stat-lbl">Lượt xem</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Forms */}
        <div className="profile-content">
          
          {/* General Info */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>Thông Tin Cơ Bản</h3>
            </div>
            <div className="admin-card-body">
              <form className="profile-form">
                <div className="form-row-2">
                  <div className="form-group-p">
                    <label><User size={16} /> Họ và Tên</label>
                    <input type="text" defaultValue="Cộng Tác Viên 01" />
                  </div>
                  <div className="form-group-p">
                    <label>Bút danh hiển thị</label>
                    <input type="text" defaultValue="Người Kể Chuyện" />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group-p">
                    <label><Mail size={16} /> Địa chỉ Email</label>
                    <input type="email" defaultValue="ctv01@example.com" disabled className="disabled-input" />
                  </div>
                  <div className="form-group-p">
                    <label><Phone size={16} /> Số điện thoại</label>
                    <input type="tel" defaultValue="090 123 4567" />
                  </div>
                </div>

                <div className="form-group-p">
                  <label><Link2 size={16} /> Portfolio / Website cá nhân</label>
                  <input type="url" defaultValue="https://my-portfolio.com" />
                </div>

                <div className="form-group-p">
                  <label>Giới thiệu ngắn (Tiểu sử)</label>
                  <textarea rows="4" defaultValue="Tôi là một người đam mê du lịch bụi và khám phá văn hóa bản địa. Luôn mong muốn được lưu giữ những giá trị truyền thống qua từng khung ảnh và dòng chữ."></textarea>
                  <span className="input-hint">Đoạn giới thiệu này sẽ xuất hiện dưới bài viết của bạn.</span>
                </div>
              </form>
            </div>
          </div>

          {/* Password Security */}
          <div className="admin-card mt-4">
            <div className="admin-card-header">
              <h3><Lock size={18} className="icon-title"/> Bảo Mật & Mật Khẩu</h3>
            </div>
            <div className="admin-card-body">
              <form className="profile-form">
                <div className="form-group-p">
                  <label>Mật khẩu hiện tại</label>
                  <input type="password" placeholder="••••••••" />
                </div>
                <div className="form-row-2">
                  <div className="form-group-p">
                    <label>Mật khẩu mới</label>
                    <input type="password" placeholder="Nhập mật khẩu mới" />
                  </div>
                  <div className="form-group-p">
                    <label>Xác nhận mật khẩu mới</label>
                    <input type="password" placeholder="Nhập lại mật khẩu" />
                  </div>
                </div>
                <button type="button" className="btn-outline mt-2">Cập nhật mật khẩu</button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CTVProfile;
