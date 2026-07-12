import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Upload, Search, X, Copy, Trash2, Calendar, FileText, CheckCircle } from 'lucide-react';
import { fetchWithAuth } from '../utils/api';
import './AdminMedia.css';

const AdminMedia = () => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  
  // States cho phân trang
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(12);

  // Copy status
  const [copySuccess, setCopySuccess] = useState(false);

  const fileInputRef = useRef(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`http://localhost:5000/api/media?page=${page}&limit=${limit}`);
      if (res.ok) {
        const data = await res.json();
        setMediaList(data.mediaList || []);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
        }
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách media:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [page]);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetchWithAuth('http://localhost:5000/api/media/upload', {
        method: 'POST',
        // Ghi đè Content-Type mặc định (không gửi application/json)
        headers: {},
        body: formData
      });

      if (res.ok) {
        fetchMedia();
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        const err = await res.json();
        alert(err.message || 'Lỗi khi upload ảnh.');
      }
    } catch (error) {
      console.error('Lỗi kết nối upload:', error);
      alert('Không thể kết nối đến máy chủ.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa hình ảnh này vĩnh viễn? Bài viết đang dùng ảnh này có thể bị hỏng ảnh.')) return;
    
    try {
      const res = await fetchWithAuth(`http://localhost:5000/api/media/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setMediaList(mediaList.filter(item => item.id !== id));
        setSelectedItem(null);
      } else {
        alert('Không thể xóa hình ảnh.');
      }
    } catch (error) {
      console.error('Lỗi kết nối xóa ảnh:', error);
    }
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredMedia = mediaList.filter(item => 
    item.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Thư Viện Quản Lý Hình Ảnh</h1>
          <p>Tải lên, quản lý tối ưu hóa dung lượng hình ảnh đám mây CDN Cloudinary của hệ thống.</p>
        </div>
      </div>

      {/* Upload & Search bar */}
      <div className="media-toolbar">
        <div 
          className="media-upload-zone"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <Upload size={24} className="upload-icon" />
          <span>{uploading ? 'Đang tải lên...' : 'Kéo thả hoặc Click để tải ảnh lên'}</span>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            style={{ display: 'none' }}
          />
        </div>

        <div className="media-search">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Tìm tên tệp tin..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="media-loading"><div className="spinner"></div></div>
      ) : filteredMedia.length > 0 ? (
        <div>
          <div className="media-grid">
            {filteredMedia.map(item => (
              <div 
                key={item.id} 
                className="media-item-card"
                onClick={() => setSelectedItem(item)}
              >
                <div className="media-preview-box">
                  <img src={item.url} alt={item.filename} />
                </div>
                <div className="media-info-box">
                  <span className="media-name" title={item.filename}>{item.filename}</span>
                  <span className="media-size">{formatBytes(item.size)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="media-pagination" style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', gap: '0.5rem' }}>
              <button 
                onClick={() => setPage(prev => Math.max(prev - 1, 1))} 
                disabled={page === 1}
                className="btn-outline"
                style={{ padding: '0.5rem 1rem' }}
              >
                Trước
              </button>
              <span style={{ alignSelf: 'center', fontWeight: '600' }}>Trang {page} / {totalPages}</span>
              <button 
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} 
                disabled={page === totalPages}
                className="btn-outline"
                style={{ padding: '0.5rem 1rem' }}
              >
                Sau
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="no-media-box">
          <ImageIcon size={48} className="no-media-icon" />
          <h3>Thư viện chưa có hình ảnh</h3>
          <p>Hãy tải ảnh lên để bắt đầu lưu trữ và nhúng bài viết.</p>
        </div>
      )}

      {/* Details Modal */}
      {selectedItem && (
        <div className="media-modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="media-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedItem(null)}>
              <X size={20} />
            </button>
            
            <div className="modal-content">
              <div className="modal-preview">
                <img src={selectedItem.url} alt={selectedItem.filename} />
              </div>

              <div className="modal-details">
                <h3>Chi Tiết Tệp Tin</h3>
                <div className="detail-row">
                  <FileText size={16} />
                  <div>
                    <label>Tên file</label>
                    <span title={selectedItem.filename}>{selectedItem.filename}</span>
                  </div>
                </div>
                <div className="detail-row">
                  <Calendar size={16} />
                  <div>
                    <label>Ngày tải lên</label>
                    <span>{new Date(selectedItem.createdAt).toLocaleString('vi-VN')}</span>
                  </div>
                </div>
                <div className="detail-row">
                  <ImageIcon size={16} />
                  <div>
                    <label>Định dạng & Dung lượng</label>
                    <span>{selectedItem.mimeType.split('/')[1].toUpperCase()} · {formatBytes(selectedItem.size)}</span>
                  </div>
                </div>
                {selectedItem.publicId && (
                  <div className="detail-row">
                    <Shield size={16} />
                    <div>
                      <label>Cloud ID (Cloudinary)</label>
                      <span>{selectedItem.publicId}</span>
                    </div>
                  </div>
                )}

                <div className="modal-url-box mt-4">
                  <label>Đường dẫn công khai (Public URL)</label>
                  <div className="url-copy-row">
                    <input type="text" readOnly value={selectedItem.url} />
                    <button 
                      onClick={() => handleCopyUrl(selectedItem.url)}
                      className={`btn-copy-url ${copySuccess ? 'copied' : ''}`}
                    >
                      {copySuccess ? <CheckCircle size={16} /> : <Copy size={16} />}
                      <span>{copySuccess ? 'Đã copy!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="modal-actions mt-4">
                  <button 
                    onClick={() => handleDelete(selectedItem.id)}
                    className="btn-delete-media"
                  >
                    <Trash2 size={16} /> Xóa ảnh vĩnh viễn
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMedia;
