import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, FileEdit, User, LogOut, Bell } from 'lucide-react';
import './CTVLayout.css'; // We will create a specific theme for CTV

const CTVLayout = () => {
  return (
    <div className="admin-container ctv-container-theme">
      {/* Sidebar - Using a green/teal theme to differentiate from Admin */}
      <aside className="admin-sidebar ctv-sidebar">
        <div className="admin-sidebar-header">
          <h2>CHÂN ĐI VÀ NẾM</h2>
          <span>Contributor Portal</span>
        </div>
        
        <nav className="admin-nav">
          <p className="admin-nav-title">NỘI DUNG</p>
          <NavLink to="/ctv" end className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} /> Tổng Quan
          </NavLink>
          <NavLink to="/ctv/my-posts" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <FileEdit size={20} /> Bài Viết Của Tôi
          </NavLink>
          
          <p className="admin-nav-title">CÁ NHÂN</p>
          <NavLink to="/ctv/profile" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <User size={20} /> Hồ Sơ
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <button className="btn-logout">
            <LogOut size={20} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main-wrapper">
        {/* Top Header */}
        <header className="admin-topbar">
          <div className="ctv-welcome">
            <h3>Khu vực làm việc của Cộng Tác Viên</h3>
          </div>
          
          <div className="admin-topbar-actions">
            <button className="action-btn">
              <Bell size={20} />
            </button>
            <div className="admin-profile">
              <img src="https://ui-avatars.com/api/?name=C+T+V&background=047857&color=fff" alt="CTV" />
              <div className="profile-info">
                <span className="profile-name">Cộng Tác Viên 01</span>
                <span className="profile-role">Tác giả độc lập</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Rendered Here */}
        <main className="admin-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CTVLayout;
