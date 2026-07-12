import React, { useState, useEffect } from 'react';
import { User, Shield, Info, Save, Key, RefreshCw } from 'lucide-react';
import './AdminCategories.css'; // Mượn style chung của admin

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [currentUser, setCurrentUser] = useState(null);
  
  // Profile Form States
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Password Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityMsg, setSecurityMsg] = useState({ type: '', text: '' });
  const [loadingSecurity, setLoadingSecurity] = useState(false);

  // System States
  const [systemStats, setSystemStats] = useState({
    serverStatus: 'Đang kiểm tra...',
    dbStatus: 'Connected (MySQL via Prisma)',
    apiVersion: '1.0.0 (Production-ready)',
    nodeVersion: 'v18.x / v20.x'
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      setFullName(user.fullName || '');
      setBio(user.bio || '');
      setAvatarUrl(user.avatarUrl || '');
    }

    // Ping thử server kiểm tra trạng thái hệ thống
    fetch('http://localhost:5000/api/health')
      .then(res => res.ok ? setSystemStats(prev => ({ ...prev, serverStatus: 'Online (Hoạt động tốt)' })) : null)
      .catch(() => setSystemStats(prev => ({ ...prev, serverStatus: 'Offline (Không kết nối được)' })));
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    setLoadingProfile(true);

    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/users/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fullName, bio, avatarUrl })
      });

      if (res.ok) {
        const updated = await res.json();
        // Cập nhật lại localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userObj = JSON.parse(userStr);
          const newUserObj = { ...userObj, ...updated };
          localStorage.setItem('user', JSON.stringify(newUserObj));
          setCurrentUser(newUserObj);
        }
        setProfileMsg({ type: 'success', text: 'Cập nhật thông tin cá nhân thành công!' });
      } else {
        const err = await res.json();
        setProfileMsg({ type: 'error', text: err.message || 'Cập nhật thất bại.' });
      }
    } catch {
      setProfileMsg({ type: 'error', text: 'Lỗi kết nối máy chủ.' });
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSecurityMsg({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setSecurityMsg({ type: 'error', text: 'Mật khẩu mới và xác nhận mật khẩu không khớp!' });
      return;
    }

    setLoadingSecurity(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/users/profile/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      if (res.ok) {
        setSecurityMsg({ type: 'success', text: 'Đổi mật khẩu thành công!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const err = await res.json();
        setSecurityMsg({ type: 'error', text: err.message || 'Thay đổi mật khẩu thất bại.' });
      }
    } catch {
      setSecurityMsg({ type: 'error', text: 'Lỗi kết nối máy chủ.' });
    } finally {
      setLoadingSecurity(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Cài Đặt Hệ Thống & Tài Khoản</h1>
          <p>Quản lý hồ sơ cá nhân, cấu hình bảo mật và giám sát thông số hệ thống.</p>
        </div>
      </div>

      <div className="category-layout">
        {/* Sidebar Tabs */}
        <div className="admin-card category-form-card" style={{ padding: '1rem', minHeight: 'auto' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button 
              onClick={() => setActiveTab('profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                width: '100%',
                padding: '0.75rem 1rem',
                border: 'none',
                borderRadius: '8px',
                background: activeTab === 'profile' ? '#9e3322' : 'transparent',
                color: activeTab === 'profile' ? 'white' : '#475569',
                fontWeight: '600',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <User size={18} /> Hồ Sơ Cá Nhân
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                width: '100%',
                padding: '0.75rem 1rem',
                border: 'none',
                borderRadius: '8px',
                background: activeTab === 'security' ? '#9e3322' : 'transparent',
                color: activeTab === 'security' ? 'white' : '#475569',
                fontWeight: '600',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Shield size={18} /> Bảo Mật & Mật Khẩu
            </button>
            <button 
              onClick={() => setActiveTab('system')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                width: '100%',
                padding: '0.75rem 1rem',
                border: 'none',
                borderRadius: '8px',
                background: activeTab === 'system' ? '#9e3322' : 'transparent',
                color: activeTab === 'system' ? 'white' : '#475569',
                fontWeight: '600',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Info size={18} /> Thông Tin Hệ Thống
            </button>
          </nav>
        </div>

        {/* Tab Contents */}
        <div className="admin-card category-list-card" style={{ padding: '2rem' }}>
          {activeTab === 'profile' && (
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b' }}>
                <User size={22} color="#9e3322" /> Cập Nhật Hồ Sơ Admin
              </h2>

              {profileMsg.text && (
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  fontSize: '0.9rem',
                  background: profileMsg.type === 'success' ? '#dcfce7' : '#fee2e2',
                  color: profileMsg.type === 'success' ? '#166534' : '#991b1b',
                  border: `1px solid ${profileMsg.type === 'success' ? '#bbf7d0' : '#fca5a5'}`
                }}>
                  {profileMsg.text}
                </div>
              )}

              <form onSubmit={handleProfileSubmit}>
                <div className="form-group-p">
                  <label style={{ fontWeight: '600', color: '#475569' }}>Địa chỉ Email (Không thể thay đổi)</label>
                  <input 
                    type="text" 
                    className="editor-input" 
                    value={currentUser?.email || ''} 
                    disabled 
                    style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
                  />
                </div>
                <div className="form-group-p mt-3">
                  <label style={{ fontWeight: '600', color: '#475569' }}>Họ và tên *</label>
                  <input 
                    type="text" 
                    className="editor-input" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group-p mt-3">
                  <label style={{ fontWeight: '600', color: '#475569' }}>Ảnh đại diện URL (Tùy chọn)</label>
                  <input 
                    type="text" 
                    className="editor-input" 
                    value={avatarUrl} 
                    placeholder="/uploads/avatars/default.png"
                    onChange={(e) => setAvatarUrl(e.target.value)}
                  />
                </div>
                <div className="form-group-p mt-3">
                  <label style={{ fontWeight: '600', color: '#475569' }}>Tiểu sử (Bio)</label>
                  <textarea 
                    className="editor-input" 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)}
                    rows="4"
                    placeholder="Viết một đoạn ngắn giới thiệu bản thân..."
                  ></textarea>
                </div>

                <button type="submit" className="btn-primary mt-4" disabled={loadingProfile}>
                  <Save size={16} /> {loadingProfile ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b' }}>
                <Key size={22} color="#9e3322" /> Đổi Mật Khẩu Bảo Mật
              </h2>

              {securityMsg.text && (
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  fontSize: '0.9rem',
                  background: securityMsg.type === 'success' ? '#dcfce7' : '#fee2e2',
                  color: securityMsg.type === 'success' ? '#166534' : '#991b1b',
                  border: `1px solid ${securityMsg.type === 'success' ? '#bbf7d0' : '#fca5a5'}`
                }}>
                  {securityMsg.text}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit}>
                <div className="form-group-p">
                  <label style={{ fontWeight: '600', color: '#475569' }}>Mật khẩu hiện tại *</label>
                  <input 
                    type="password" 
                    className="editor-input" 
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group-p mt-3">
                  <label style={{ fontWeight: '600', color: '#475569' }}>Mật khẩu mới *</label>
                  <input 
                    type="password" 
                    className="editor-input" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group-p mt-3">
                  <label style={{ fontWeight: '600', color: '#475569' }}>Xác nhận mật khẩu mới *</label>
                  <input 
                    type="password" 
                    className="editor-input" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn-primary mt-4" disabled={loadingSecurity}>
                  <RefreshCw size={16} /> {loadingSecurity ? 'Đang đổi...' : 'Đổi Mật Khẩu'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'system' && (
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b' }}>
                <Info size={22} color="#9e3322" /> Thông Số Trạng Thái Hệ Thống
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                  <span style={{ width: '200px', fontWeight: '600', color: '#475569' }}>API Backend:</span>
                  <span style={{ color: systemStats.serverStatus.includes('Online') ? '#166534' : '#991b1b', fontWeight: 'bold' }}>{systemStats.serverStatus}</span>
                </div>
                <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                  <span style={{ width: '200px', fontWeight: '600', color: '#475569' }}>Cơ sở dữ liệu (Database):</span>
                  <span style={{ color: '#0f172a', fontWeight: '500' }}>{systemStats.dbStatus}</span>
                </div>
                <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                  <span style={{ width: '200px', fontWeight: '600', color: '#475569' }}>REST API Version:</span>
                  <span style={{ color: '#0f172a', fontWeight: '500' }}>{systemStats.apiVersion}</span>
                </div>
                <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                  <span style={{ width: '200px', fontWeight: '600', color: '#475569' }}>NodeJS Environment:</span>
                  <span style={{ color: '#0f172a', fontWeight: '500' }}>{systemStats.nodeVersion}</span>
                </div>
                <div style={{ display: 'flex', paddingBottom: '0.75rem' }}>
                  <span style={{ width: '200px', fontWeight: '600', color: '#475569' }}>Cổng chạy Client (Vite):</span>
                  <span style={{ color: '#0f172a', fontWeight: '500' }}>{window.location.port} (Vite JS Dev Server)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
