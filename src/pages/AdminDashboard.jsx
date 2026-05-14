import React from 'react';
import { Eye, FileText, Users, MessageSquare } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './AdminDashboard.css';

const viewData = [
  { name: 'T2', views: 4000 },
  { name: 'T3', views: 3000 },
  { name: 'T4', views: 5000 },
  { name: 'T5', views: 2780 },
  { name: 'T6', views: 6890 },
  { name: 'T7', views: 8390 },
  { name: 'CN', views: 10490 },
];

const categoryData = [
  { name: 'Văn Hóa', value: 45 },
  { name: 'Ẩm Thực', value: 35 },
  { name: 'Điểm Đến', value: 20 },
];

const COLORS = ['#9e3322', '#d97706', '#0ea5e9'];

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Tổng Quan Hệ Thống</h1>
        <p>Thống kê chi tiết hoạt động của website ngày hôm nay.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-blue">
            <Eye size={24} color="#0ea5e9" />
          </div>
          <div className="stat-info">
            <span className="stat-value">124.5K</span>
            <span className="stat-label">Lượt xem trang</span>
          </div>
          <div className="stat-trend positive">+12% vs tuần trước</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-red">
            <FileText size={24} color="#9e3322" />
          </div>
          <div className="stat-info">
            <span className="stat-value">342</span>
            <span className="stat-label">Bài viết đã xuất bản</span>
          </div>
          <div className="stat-trend positive">+5 bài mới</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-green">
            <Users size={24} color="#10b981" />
          </div>
          <div className="stat-info">
            <span className="stat-value">1,204</span>
            <span className="stat-label">Người đăng ký bản tin</span>
          </div>
          <div className="stat-trend positive">+128 tuần này</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-orange">
            <MessageSquare size={24} color="#f59e0b" />
          </div>
          <div className="stat-info">
            <span className="stat-value">18</span>
            <span className="stat-label">Góp ý chưa đọc</span>
          </div>
          <div className="stat-trend negative">Cần xử lý ngay</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="admin-card chart-card-large">
          <div className="admin-card-header">
            <h3>Thống Kê Lượt Xem (7 Ngày Qua)</h3>
          </div>
          <div className="admin-card-body" style={{ height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viewData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="views" stroke="#9e3322" strokeWidth={4} dot={{ r: 6, fill: '#9e3322', strokeWidth: 2, stroke: 'white' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="admin-card chart-card-small">
          <div className="admin-card-header">
            <h3>Tỉ Lệ Chuyên Mục</h3>
          </div>
          <div className="admin-card-body" style={{ height: 350, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="pie-legend">
              {categoryData.map((entry, index) => (
                <div key={`legend-${index}`} className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: COLORS[index] }}></div>
                  <span>{entry.name} ({entry.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default AdminDashboard;
