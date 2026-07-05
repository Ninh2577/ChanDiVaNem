import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Eye, MousePointerClick, TrendingUp, Plus, Trash2, Edit2, 
  Calendar, LayoutDashboard, Image as ImageIcon, Upload, X, RefreshCw, BarChart3
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area
} from 'recharts';
import { fetchWithAuth } from '../utils/api';
import './AdminAds.css';

const API = 'http://localhost:5000';

// ---- ImageUploadField ----
const ImageUploadField = ({ label, value, onChange }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await fetchWithAuth(`${API}/api/upload`, {
        method: 'POST',
        body: fd,
      });
      if (res.ok) {
        const data = await res.json();
        onChange(data.imageUrl);
      } else {
        alert('Tải ảnh thất bại!');
      }
    } catch (err) { 
      console.error(err);
      alert('Lỗi tải ảnh lên!'); 
    } finally { 
      setUploading(false); 
    }
  };

  const displaySrc = value ? `${API}${value}` : '';

  return (
    <div className="form-group-p">
      <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
        <ImageIcon size={14} /> {label}
      </label>
      <div className="upload-box" style={{ position: 'relative', overflow: 'hidden', minHeight: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #cbd5e1', borderRadius: '10px', cursor: 'pointer', background: '#f8fafc', transition: 'all 0.2s', padding: '1rem' }}>
        {displaySrc ? (
          <>
            <img src={displaySrc} alt={label} style={{ width: '100%', maxHeight: '120px', objectFit: 'contain', borderRadius: '8px' }} />
            <div className="upload-box-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', opacity: 0, transition: 'opacity 0.2s', borderRadius: '8px' }} onMouseEnter={(e) => e.currentTarget.style.opacity=1} onMouseLeave={(e) => e.currentTarget.style.opacity=0}>
               Bấm để đổi ảnh
            </div>
          </>
        ) : (
          <>
            <Upload size={24} color={uploading ? "#10b981" : "#94a3b8"} style={{ marginBottom: '4px' }} />
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{uploading ? 'Đang tải lên...' : 'Bấm để tải ảnh quảng cáo'}</span>
          </>
        )}
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleUpload} 
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10 }} 
          title="Chọn ảnh quảng cáo"
        />
      </div>
    </div>
  );
};

const AdminAds = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [position, setPosition] = useState('POPUP_CENTER');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [contractValue, setContractValue] = useState('');
  const [displayInterval, setDisplayInterval] = useState('5');
  const [isActive, setIsActive] = useState(true);

  const fetchCampaigns = async () => {
    try {
      const res = await fetchWithAuth(`${API}/api/ads`);
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data);
      }
    } catch (err) {
      console.error('Lỗi lấy danh sách quảng cáo:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleEdit = (campaign) => {
    setEditId(campaign.id);
    setTitle(campaign.title);
    setImageUrl(campaign.imageUrl);
    setTargetUrl(campaign.targetUrl);
    setPosition(campaign.position);
    setStartDate(new Date(campaign.startDate).toISOString().split('T')[0]);
    setEndDate(new Date(campaign.endDate).toISOString().split('T')[0]);
    setContractValue(campaign.contractValue.toString());
    setDisplayInterval(campaign.displayInterval.toString());
    setIsActive(campaign.isActive);
    
    // Cuộn lên form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setImageUrl('');
    setTargetUrl('');
    setPosition('POPUP_CENTER');
    setStartDate('');
    setEndDate('');
    setContractValue('');
    setDisplayInterval('5');
    setIsActive(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !imageUrl || !targetUrl || !startDate || !endDate) {
      alert('Vui lòng điền đầy đủ các thông tin bắt buộc và tải lên hình ảnh!');
      return;
    }

    setSubmitting(true);
    const payload = {
      title,
      imageUrl,
      targetUrl,
      position,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      contractValue: parseFloat(contractValue) || 0,
      displayInterval: parseInt(displayInterval) || 5,
      isActive
    };

    try {
      const url = editId ? `${API}/api/ads/${editId}` : `${API}/api/ads`;
      const method = editId ? 'PUT' : 'POST';
      
      const res = await fetchWithAuth(url, {
        method,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert(editId ? 'Cập nhật chiến dịch thành công!' : 'Tạo chiến dịch quảng cáo mới thành công!');
        setEditId(null);
        resetForm();
        fetchCampaigns();
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Lỗi xử lý yêu cầu.');
      }
    } catch (err) {
      console.error(err);
      alert('Không thể kết nối Backend.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa chiến dịch quảng cáo này?')) return;
    try {
      const res = await fetchWithAuth(`${API}/api/ads/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert('Xóa chiến dịch thành công!');
        fetchCampaigns();
        if (editId === id) {
          handleCancelEdit();
        }
      } else {
        alert('Xóa thất bại.');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối.');
    }
  };

  const handleToggleStatus = async (campaign) => {
    try {
      const res = await fetchWithAuth(`${API}/api/ads/${campaign.id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: !campaign.isActive })
      });
      if (res.ok) {
        fetchCampaigns();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Tính toán số liệu thống kê tổng hợp
  const totalRevenue = campaigns.reduce((sum, c) => sum + (c.contractValue || 0), 0);
  const totalViews = campaigns.reduce((sum, c) => sum + (c.viewCount || 0), 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + (c.clickCount || 0), 0);
  const avgCtr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : '0.00';

  // Chuẩn bị dữ liệu biểu đồ Recharts
  const chartData = [...campaigns].reverse().map(c => ({
    name: c.title.length > 15 ? c.title.substring(0, 15) + '...' : c.title,
    'Doanh thu (VNĐ)': c.contractValue,
    'Hiển thị': c.viewCount,
    'Nhấp chuột': c.clickCount,
    'CTR (%)': c.viewCount > 0 ? parseFloat(((c.clickCount / c.viewCount) * 100).toFixed(2)) : 0
  }));

  if (loading) {
    return <div className="admin-page"><p style={{ padding: '2rem', color: '#64748b' }}>Đang tải dữ liệu Quảng cáo & Doanh thu...</p></div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>📊 Quản Lý Quảng Cáo & Doanh Thu</h1>
          <p>Thiết lập chiến dịch Popup/Banner, theo dõi lượt hiển thị (views), lượt nhấp chuột (clicks) và thống kê doanh thu hợp đồng.</p>
        </div>
      </div>

      <div className="admin-ads-container">
        
        {/* Khối thống kê tổng quan */}
        <div className="stats-grid">
          <div className="stat-card revenue">
            <div className="stat-icon"><DollarSign size={20} /></div>
            <div className="stat-info">
              <span className="stat-label">Tổng Doanh Thu</span>
              <span className="stat-value">{totalRevenue.toLocaleString('vi-VN')} đ</span>
            </div>
          </div>
          
          <div className="stat-card views">
            <div className="stat-icon"><Eye size={20} /></div>
            <div className="stat-info">
              <span className="stat-label">Tổng Lượt Hiển Thị</span>
              <span className="stat-value">{totalViews.toLocaleString('vi-VN')}</span>
            </div>
          </div>

          <div className="stat-card clicks">
            <div className="stat-icon"><MousePointerClick size={20} /></div>
            <div className="stat-info">
              <span className="stat-label">Tổng Lượt Click</span>
              <span className="stat-value">{totalClicks.toLocaleString('vi-VN')}</span>
            </div>
          </div>

          <div className="stat-card ctr">
            <div className="stat-icon"><TrendingUp size={20} /></div>
            <div className="stat-info">
              <span className="stat-label">CTR Trung Bình</span>
              <span className="stat-value">{avgCtr}%</span>
            </div>
          </div>
        </div>

        {/* Biểu đồ báo cáo doanh thu */}
        {campaigns.length > 0 && (
          <div className="charts-grid">
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title"><DollarSign size={16} color="#10b981" /> Biểu đồ Doanh thu Chiến dịch</h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Theo VNĐ</span>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000000).toFixed(1)}M`} />
                    <Tooltip 
                      formatter={(value) => [`${value.toLocaleString('vi-VN')} VNĐ`, 'Doanh thu']}
                      contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', fontSize: '12px' }}
                    />
                    <Bar dataKey="Doanh thu (VNĐ)" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={45} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title"><BarChart3 size={16} color="#8b5cf6" /> Hiệu suất Tỉ lệ Nhấp (CTR)</h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Theo %</span>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} unit="%" />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Tỷ lệ CTR']}
                      contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', fontSize: '12px' }}
                    />
                    <defs>
                      <linearGradient id="colorCtr" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="CTR (%)" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorCtr)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Khu vực CRUD chiến dịch quảng cáo */}
        <div className="ads-layout">
          
          {/* Bảng danh sách chiến dịch */}
          <div className="admin-card">
            <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1rem', color: '#1e293b', fontWeight: 700 }}>Danh Sách Chiến Dịch</h3>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Tổng số: {campaigns.length}</span>
            </div>
            <div className="admin-card-body" style={{ padding: 0 }}>
              <div className="admin-table-wrapper" style={{ overflowX: 'auto' }}>
                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '1rem' }}>Hình ảnh</th>
                      <th style={{ padding: '1rem' }}>Chiến dịch / Thời gian</th>
                      <th style={{ padding: '1rem' }}>Vị trí</th>
                      <th style={{ padding: '1rem' }}>Hiệu suất</th>
                      <th style={{ padding: '1rem' }}>Doanh thu</th>
                      <th style={{ padding: '1rem' }}>Trạng thái</th>
                      <th style={{ padding: '1rem', textAlign: 'center' }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.length > 0 ? (
                      campaigns.map(c => {
                        const campaignCtr = c.viewCount > 0 ? ((c.clickCount / c.viewCount) * 100).toFixed(2) : '0.00';
                        return (
                          <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '1rem' }}>
                              <img src={`${API}${c.imageUrl}`} alt="" className="ad-thumbnail" />
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <div className="ad-meta-info">
                                <span className="ad-title-text">{c.title}</span>
                                <span className="ad-date-text" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Calendar size={12} /> {new Date(c.startDate).toLocaleDateString('vi-VN')} - {new Date(c.endDate).toLocaleDateString('vi-VN')}
                                </span>
                              </div>
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <span className={`position-badge pos-${c.position.toLowerCase()}`}>
                                {c.position === 'POPUP_CENTER' ? 'Popup Giữa' : c.position === 'POPUP_BOTTOM_RIGHT' ? 'Popup Góc' : c.position === 'BANNER_TOP' ? 'Banner Top' : 'Banner Sidebar'}
                              </span>
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <div style={{ fontSize: '0.78rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span>👁️ Views: <strong>{c.viewCount}</strong></span>
                                <span>🖱️ Clicks: <strong>{c.clickCount}</strong></span>
                                <span>📈 CTR: <strong style={{ color: '#8b5cf6' }}>{campaignCtr}%</strong></span>
                              </div>
                            </td>
                            <td style={{ padding: '1rem', fontWeight: 700, color: '#10b981', fontSize: '0.875rem' }}>
                              {c.contractValue.toLocaleString('vi-VN')} đ
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <button 
                                className="status-toggle" 
                                onClick={() => handleToggleStatus(c)} 
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                title={c.isActive ? 'Tắt kích hoạt' : 'Bật kích hoạt'}
                              >
                                <span className={`status-indicator ${c.isActive ? 'active' : 'inactive'}`}></span>
                                <span className={`status-text ${c.isActive ? 'active' : 'inactive'}`}>
                                  {c.isActive ? 'Đang chạy' : 'Đã dừng'}
                                </span>
                              </button>
                            </td>
                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                <button className="header-icon-btn" style={{ width: '30px', height: '30px' }} onClick={() => handleEdit(c)} title="Sửa chiến dịch">
                                  <Edit2 size={13} color="#475569" />
                                </button>
                                <button className="header-icon-btn" style={{ width: '30px', height: '30px' }} onClick={() => handleDelete(c.id)} title="Xóa chiến dịch">
                                  <Trash2 size={13} color="#ef4444" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                          Chưa có chiến dịch quảng cáo nào được thiết lập. Hãy tạo chiến dịch đầu tiên ở form bên phải!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Form thêm mới/sửa chiến dịch */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 style={{ fontSize: '1rem', color: '#1e293b', fontWeight: 700 }}>
                {editId ? '📝 Chỉnh Sửa Chiến Dịch' : '➕ Tạo Chiến Dịch Mới'}
              </h3>
            </div>
            <div className="admin-card-body" style={{ padding: '1.25rem' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                <h4 className="form-section-title">1. Thông tin cơ bản</h4>
                
                <div className="form-group-p">
                  <label className="field-label" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Tên chiến dịch quảng cáo *</label>
                  <input 
                    type="text" 
                    className="field-input" 
                    placeholder="Ví dụ: Chiến dịch mùa hè Vinamilk" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group-p">
                  <label className="field-label" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Đường dẫn đích (Target URL) *</label>
                  <input 
                    type="url" 
                    className="field-input" 
                    placeholder="https://vinamilk.com.vn/khuyenmai" 
                    value={targetUrl} 
                    onChange={e => setTargetUrl(e.target.value)} 
                    required 
                  />
                </div>

                <ImageUploadField 
                  label="Ảnh Banner / Popup Quảng Cáo *" 
                  value={imageUrl} 
                  onChange={setImageUrl} 
                />

                <h4 className="form-section-title">2. Cấu hình phân phối & Doanh thu</h4>

                <div className="fields-grid-2">
                  <div className="form-group-p">
                    <label className="field-label" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Vị trí hiển thị</label>
                    <select 
                      className="field-input" 
                      value={position} 
                      onChange={e => setPosition(e.target.value)}
                      style={{ height: '40px', padding: '0 0.5rem' }}
                    >
                      <option value="POPUP_CENTER">Popup giữa màn hình</option>
                      <option value="POPUP_BOTTOM_RIGHT">Popup góc phải dưới</option>
                      <option value="BANNER_TOP">Banner đầu trang chủ</option>
                      <option value="BANNER_SIDEBAR">Banner Sidebar dọc</option>
                    </select>
                  </div>

                  <div className="form-group-p">
                    <label className="field-label" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Trễ hiển thị (Giây)</label>
                    <input 
                      type="number" 
                      className="field-input" 
                      placeholder="5" 
                      min="0"
                      value={displayInterval} 
                      onChange={e => setDisplayInterval(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="fields-grid-2">
                  <div className="form-group-p">
                    <label className="field-label" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Ngày bắt đầu *</label>
                    <input 
                      type="date" 
                      className="field-input" 
                      value={startDate} 
                      onChange={e => setStartDate(e.target.value)} 
                      required 
                    />
                  </div>

                  <div className="form-group-p">
                    <label className="field-label" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Ngày kết thúc *</label>
                    <input 
                      type="date" 
                      className="field-input" 
                      value={endDate} 
                      onChange={e => setEndDate(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                <div className="form-group-p">
                  <label className="field-label" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Giá trị hợp đồng (VNĐ)</label>
                  <input 
                    type="number" 
                    className="field-input" 
                    placeholder="Ví dụ: 15000000" 
                    value={contractValue} 
                    onChange={e => setContractValue(e.target.value)} 
                  />
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px', display: 'block' }}>Dùng làm chỉ số báo cáo doanh thu tài chính.</span>
                </div>

                <div className="form-group-p" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <input 
                    type="checkbox" 
                    id="isActiveCheckbox" 
                    checked={isActive} 
                    onChange={e => setIsActive(e.target.checked)} 
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <label htmlFor="isActiveCheckbox" style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>Kích hoạt chiến dịch ngay</label>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                  {editId && (
                    <button type="button" className="btn-save" style={{ background: '#64748b', flex: 1 }} onClick={handleCancelEdit}>
                      Hủy Sửa
                    </button>
                  )}
                  <button type="submit" className="btn-save" style={{ flex: 2 }} disabled={submitting}>
                    {submitting ? <RefreshCw size={16} className="spin" /> : editId ? 'Cập Nhật' : 'Tạo Chiến Dịch'}
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminAds;
