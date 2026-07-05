import React, { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { fetchWithAuth } from '../utils/api';
import './AdminTable.css';

const AdminUsers = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dữ liệu từ API
  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, appsRes] = await Promise.all([
        fetchWithAuth('http://localhost:5000/api/users'),
        fetchWithAuth('http://localhost:5000/api/applications')
      ]);
      
      if (usersRes.ok) setUsers(await usersRes.json());
      if (appsRes.ok) setApplications(await appsRes.json());
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTimer = window.setTimeout(() => {
      void fetchData();
    }, 0);
    return () => window.clearTimeout(fetchTimer);
  }, []);

  const handleApproveCTV = async (id) => {
    if(window.confirm('Bạn có chắc chắn cấp quyền Cộng Tác Viên cho người dùng này?')) {
      try {
        const res = await fetchWithAuth(`http://localhost:5000/api/applications/${id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'APPROVED' })
        });
        if (res.ok) {
          alert('Đã cấp quyền CTV thành công! Một tài khoản mới đã được tạo với mật khẩu: Ctv123456@');
          fetchData(); // Tải lại danh sách
        }
      } catch {
        alert('Lỗi kết nối máy chủ!');
      }
    }
  };

  const handleRejectCTV = async (id) => {
    if(window.confirm('Từ chối đơn ứng tuyển này?')) {
      try {
        const res = await fetchWithAuth(`http://localhost:5000/api/applications/${id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'REJECTED' })
        });
        if (res.ok) {
          fetchData();
        }
      } catch {
        alert('Lỗi kết nối máy chủ!');
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if(window.confirm('Xóa người dùng này vĩnh viễn?')) {
      try {
        const res = await fetchWithAuth(`http://localhost:5000/api/users/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          fetchData();
        }
      } catch {
        alert('Lỗi kết nối máy chủ!');
      }
    }
  };

  // Tính toán dữ liệu hiển thị dựa trên Tab
  const getDisplayData = () => {
    if (activeTab === 'pending') {
      return applications.filter(app => app.status === 'PENDING').map(app => ({
        ...app,
        type: 'application',
        name: app.fullName,
        date: new Date(app.createdAt).toLocaleDateString('vi-VN')
      }));
    }
    
    let filteredUsers = users;
    if (activeTab === 'contributor') {
      filteredUsers = users.filter(user => user.role === 'CTV');
    }
    
    return filteredUsers.map(user => ({
      ...user,
      type: 'user',
      name: user.fullName,
      date: new Date(user.createdAt).toLocaleDateString('vi-VN')
    }));
  };

  const displayData = getDisplayData();
  const pendingCount = applications.filter(a => a.status === 'PENDING').length;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Quản Lý Người Dùng & CTV</h1>
          <p>Quản lý tài khoản, cấp quyền Cộng tác viên và duyệt hồ sơ đăng ký.</p>
        </div>
      </div>

      <div className="admin-card">
        <div className="table-toolbar">
          <div className="tabs">
            <button className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>Tất cả</button>
            <button className={`tab-btn ${activeTab === 'contributor' ? 'active' : ''}`} onClick={() => setActiveTab('contributor')}>Cộng Tác Viên</button>
            <button className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>Đơn ứng tuyển CTV {pendingCount > 0 && <span className="tab-badge warning-bg">{pendingCount}</span>}</button>
          </div>
          
          <div className="toolbar-actions">
            <div className="search-box">
              <Search size={16} />
              <input type="text" placeholder="Tìm kiếm..." />
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Vai trò / Trạng thái</th>
                <th>Ngày</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-8">Đang tải dữ liệu...</td></tr>
              ) : displayData.length === 0 ? (
                <tr><td colSpan="5" className="text-center empty-state">Không có dữ liệu nào.</td></tr>
              ) : (
                displayData.map(item => (
                  <tr key={`${item.type}-${item.id}`}>
                    <td className="font-medium">
                      <div className="user-name-cell">
                        <div className="user-avatar">{item.name ? item.name.charAt(0) : '?'}</div>
                        {item.name}
                      </div>
                    </td>
                    <td>{item.email}</td>
                    <td>
                      {item.type === 'user' ? (
                        <>
                          {item.role === 'ADMIN' && <span className="role-badge admin">Quản Trị Viên</span>}
                          {item.role === 'CTV' && <span className="role-badge ctv">Cộng Tác Viên</span>}
                          {item.role === 'READER' && <span className="role-badge user">Thành Viên</span>}
                        </>
                      ) : (
                        <span className="status-badge warning">Chờ duyệt CTV</span>
                      )}
                    </td>
                    <td>{item.date}</td>
                    <td className="text-right actions-cell">
                      {item.type === 'application' && (
                        <>
                          <a href={item.portfolioLink} target="_blank" rel="noreferrer" className="action-btn-text" title="Xem CV"><Eye size={16} /> Xem CV</a>
                          <button className="action-icon success" title="Duyệt CTV" onClick={() => handleApproveCTV(item.id)}><CheckCircle size={18} /></button>
                          <button className="action-icon danger" title="Từ chối" onClick={() => handleRejectCTV(item.id)}><XCircle size={18} /></button>
                        </>
                      )}
                      {item.type === 'user' && item.role !== 'ADMIN' && (
                        <button className="action-icon danger" title="Xóa tài khoản" onClick={() => handleDeleteUser(item.id)}><Trash2 size={18} /></button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
