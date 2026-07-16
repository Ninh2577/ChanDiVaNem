import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, MapPin, Coffee, Settings, LogOut, Bell, Search, Layout, Home, DollarSign, Image } from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>CHÂN ĐI VÀ NẾM</h2>
          <span>Admin Portal</span>
        </div>
        
        <nav className="admin-nav">
          <p className="admin-nav-title">QUẢN TRỊ</p>
          <NavLink to="/admin" end className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/admin/posts" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <FileText size={20} /> Bài viết
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <Users size={20} /> Người dùng
          </NavLink>
          <NavLink to="/admin/categories" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <Layout size={20} /> Danh mục
          </NavLink>
          
          <p className="admin-nav-title">NỘI DUNG</p>
          <NavLink to="/admin/destinations" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <MapPin size={20} /> Điểm đến
          </NavLink>
          <NavLink to="/admin/cuisine" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <Coffee size={20} /> Ẩm thực
          </NavLink>

          <p className="admin-nav-title">HỆ THỐNG</p>
          <NavLink to="/admin/homepage" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <Home size={20} /> Trang Chủ CMS
          </NavLink>
          <NavLink to="/admin/ads" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <DollarSign size={20} /> Quảng Cáo & Doanh Thu
          </NavLink>
          <NavLink to="/admin/navigation" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <Layout size={20} /> Quản lý Menu
          </NavLink>
          <NavLink to="/admin/media" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <Image size={20} /> Thư viện ảnh
          </NavLink>
          <NavLink to="/admin/settings" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <Settings size={20} /> Cài đặt
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <button className="btn-logout" onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}>
            <LogOut size={20} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main-wrapper">
        {/* Top Header */}
        <header className="admin-topbar">
          <div className="admin-search">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Tìm kiếm bài viết, người dùng..." />
          </div>
          
          <div className="admin-topbar-actions">
            <button className="action-btn">
              <Bell size={20} />
              <span className="badge">3</span>
            </button>
            <div className="admin-profile">
              <img src={`https://ui-avatars.com/api/?name=${JSON.parse(localStorage.getItem('user'))?.fullName || 'Admin'}&background=9e3322&color=fff`} alt="Admin" />
              <div className="profile-info">
                <span className="profile-name">{JSON.parse(localStorage.getItem('user'))?.fullName || 'Chưa đăng nhập'}</span>
                <span className="profile-role">{JSON.parse(localStorage.getItem('user'))?.role || 'Guest'}</span>
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

export default AdminLayout;
