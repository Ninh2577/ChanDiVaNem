import React, { useState, useEffect } from 'react';
import { Save, Upload, X, LayoutDashboard, Image as Img, Link as LinkIcon, RefreshCw } from 'lucide-react';
import './AdminHomepage.css';

const API = 'http://localhost:5000';

// ---- Nhỏ: ImageUploadField ----
const ImageUploadField = ({ label, value, fallback, onChange }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (res.ok) {
        const data = await res.json();
        onChange(data.imageUrl);
      }
    } catch { alert('Upload thất bại!'); }
    finally { setUploading(false); }
  };

  const displaySrc = value ? `${API}${value}` : fallback;

  return (
    <div className="img-field">
      <label className="field-label"><Img size={14} /> {label}</label>
      <div className="img-field-body">
        {displaySrc && (
          <img src={displaySrc} alt={label} className="img-field-preview" />
        )}
        <div className="img-field-actions">
          <label className="btn-upload">
            {uploading ? <RefreshCw size={14} className="spin" /> : <Upload size={14} />}
            {value ? 'Thay ảnh' : 'Upload ảnh'}
            <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
          </label>
          {value && (
            <button className="btn-remove-img" onClick={() => onChange('')} title="Xóa ảnh (dùng ảnh mặc định)">
              <X size={13} /> Xóa
            </button>
          )}
          {value && <span className="img-using-custom">✓ Đang dùng ảnh tùy chỉnh</span>}
          {!value && fallback && <span className="img-using-default">Đang dùng ảnh mặc định</span>}
        </div>
      </div>
    </div>
  );
};

// ---- Nhỏ: TextField ----
const TF = ({ label, value, onChange, placeholder, textarea, type = 'text' }) => (
  <div className="form-field">
    <label className="field-label">{label}</label>
    {textarea
      ? <textarea className="field-input field-textarea" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={4} />
      : <input type={type} className="field-input" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    }
  </div>
);

// ======================================================
// TAB 1 — SECTION SỨ MỆNH
// ======================================================
const AboutTab = ({ data, onSave, saving }) => {
  const [d, setD] = useState(data);
  const set = (k, v) => setD(prev => ({ ...prev, [k]: v }));

  return (
    <div className="tab-content">
      <div className="tab-desc">
        <LayoutDashboard size={16} /> Section "Sứ mệnh của chúng tôi" — phần giới thiệu nằm ngay dưới hero
      </div>
      <div className="fields-grid-2">
        <TF label="Badge nhỏ phía trên" value={d.badgeText} onChange={v => set('badgeText', v)} placeholder="SỨ MỆNH CỦA CHÚNG TÔI" />
        <TF label="CTA Text (nút/link)" value={d.ctaText} onChange={v => set('ctaText', v)} placeholder="Tìm hiểu thêm về di sản →" />
      </div>
      <TF label="Tiêu đề lớn (xuống dòng bằng \\n)" value={d.title} onChange={v => set('title', v)} placeholder="Lưu giữ và Lan tỏa\nTinh hoa Văn hóa Việt" />
      <TF label="Đoạn mô tả" value={d.description} onChange={v => set('description', v)} placeholder="CHÂN ĐI VÀ NẾM ra đời..." textarea />
      <div className="fields-grid-2">
        <div>
          <TF label="CTA Link (đường dẫn hoặc URL)" value={d.ctaLink} onChange={v => set('ctaLink', v)} placeholder="/about" />
          <p className="field-hint"><LinkIcon size={12} /> Ví dụ: /about, /blog, /destinations</p>
        </div>
        <TF label="Nội dung quote" value={d.quoteText} onChange={v => set('quoteText', v)} placeholder="Mỗi tác phẩm là một câu chuyện..." />
      </div>

      <ImageUploadField
        label="Ảnh minh họa bên phải"
        value={d.imageUrl}
        fallback={d.imageFallback}
        onChange={v => set('imageUrl', v)}
      />

      <div className="save-row">
        <button className="btn-save" onClick={() => onSave('home_about', d)} disabled={saving}>
          <Save size={16} /> {saving ? 'Đang lưu...' : 'Lưu Section Sứ mệnh'}
        </button>
      </div>
    </div>
  );
};

// ======================================================
// TAB 2 — DESTINATIONS GRID
// ======================================================
const DestCard = ({ card, idx, onChange }) => {
  const set = (k, v) => onChange(idx, { ...card, [k]: v });
  return (
    <div className={`dest-card-editor ${card.isMain ? 'is-main' : ''}`}>
      <div className="dest-card-badge">{card.isMain ? '📌 Card LỚN (trái)' : `Card nhỏ ${idx}`}</div>
      <div className="fields-grid-2">
        <TF label="Region label" value={card.region} onChange={v => set('region', v)} placeholder="MIỀN BẮC" />
        <TF label="Tiêu đề" value={card.title} onChange={v => set('title', v)} placeholder="Hùng vĩ Đông Tây Bắc" />
      </div>
      <TF label="Link khi click" value={card.link} onChange={v => set('link', v)} placeholder="/destinations" />
      <ImageUploadField label="Ảnh card" value={card.imageUrl} fallback={card.imageFallback} onChange={v => set('imageUrl', v)} />
    </div>
  );
};

const DestinationsTab = ({ data, onSave, saving }) => {
  const [d, setD] = useState(data);
  const set = (k, v) => setD(prev => ({ ...prev, [k]: v }));
  const updateCard = (idx, card) => setD(prev => {
    const cards = [...prev.cards];
    cards[idx] = card;
    return { ...prev, cards };
  });

  return (
    <div className="tab-content">
      <div className="tab-desc">
        Section "Hành trình Xuyên Việt" — lưới 3 ảnh điểm đến nổi bật
      </div>
      <div className="fields-grid-2">
        <TF label="Tiêu đề section" value={d.sectionTitle} onChange={v => set('sectionTitle', v)} placeholder="Hành trình Xuyên Việt" />
        <TF label="Mô tả nhỏ" value={d.sectionSubtitle} onChange={v => set('sectionSubtitle', v)} placeholder="Khám phá sự khác biệt..." />
      </div>
      <div className="dest-cards-list">
        {d.cards.map((card, idx) => (
          <DestCard key={idx} card={card} idx={idx} onChange={updateCard} />
        ))}
      </div>
      <div className="save-row">
        <button className="btn-save" onClick={() => onSave('home_destinations', d)} disabled={saving}>
          <Save size={16} /> {saving ? 'Đang lưu...' : 'Lưu Section Điểm đến'}
        </button>
      </div>
    </div>
  );
};

// ======================================================
// TAB 3 — FOODS / QUẢNG CÁO SLOT
// ======================================================
const FoodCard = ({ card, idx, onChange }) => {
  const set = (k, v) => onChange(idx, { ...card, [k]: v });
  return (
    <div className="food-card-editor">
      <div className="dest-card-badge">Slot quảng cáo #{idx + 1}</div>
      <div className="fields-grid-3">
        <TF label="Badge / Địa điểm" value={card.badge} onChange={v => set('badge', v)} placeholder="HÀ NỘI" />
        <TF label="Tên món / Tiêu đề" value={card.name} onChange={v => set('name', v)} placeholder="Phở Bò" />
        <TF label="Link (để trống = không link)" value={card.link} onChange={v => set('link', v)} placeholder="/post/pho-bo" />
      </div>
      <TF label="Mô tả ngắn" value={card.description} onChange={v => set('description', v)} placeholder="Mô tả ngắn..." textarea />
      <ImageUploadField label="Ảnh" value={card.imageUrl} fallback={card.imageFallback} onChange={v => set('imageUrl', v)} />
    </div>
  );
};

const FoodsTab = ({ data, onSave, saving }) => {
  const [d, setD] = useState(data);
  const set = (k, v) => setD(prev => ({ ...prev, [k]: v }));
  const updateCard = (idx, card) => setD(prev => {
    const cards = [...prev.cards];
    cards[idx] = card;
    return { ...prev, cards };
  });

  return (
    <div className="tab-content">
      <div className="tab-desc">
        Section "Đặc sản Tiêu biểu" — 3 slot có thể dùng cho quảng cáo, bài viết tài trợ, hoặc nội dung tùy chọn
      </div>
      <div className="fields-grid-2">
        <TF label="Sub-title nhỏ phía trên" value={d.sectionSubtitle} onChange={v => set('sectionSubtitle', v)} placeholder="VỊ NGON XỨ VIỆT" />
        <TF label="Tiêu đề section" value={d.sectionTitle} onChange={v => set('sectionTitle', v)} placeholder="Đặc sản Tiêu biểu" />
      </div>
      <div className="food-cards-list">
        {d.cards.map((card, idx) => (
          <FoodCard key={idx} card={card} idx={idx} onChange={updateCard} />
        ))}
      </div>
      <div className="save-row">
        <button className="btn-save" onClick={() => onSave('home_foods', d)} disabled={saving}>
          <Save size={16} /> {saving ? 'Đang lưu...' : 'Lưu Section Đặc sản / Quảng cáo'}
        </button>
      </div>
    </div>
  );
};

// ======================================================
// TAB 4 — GÓC NHÌN VĂN HÓA (CHỌN BÀI VIẾT)
// ======================================================
const CultureTab = ({ data, onSave, saving }) => {
  const [d, setD] = useState(data);
  const [posts, setPosts] = useState([]);
  const set = (k, v) => setD(prev => ({ ...prev, [k]: v }));

  useEffect(() => {
    fetch('http://localhost:5000/api/posts/published')
      .then(r => r.json())
      .then(setPosts)
      .catch(() => {
        console.warn('Không thể tải danh sách bài viết xuất bản.');
      });
  }, []);

  const togglePost = (postId) => {
    let newIds = [...d.featuredPostIds];
    if (newIds.includes(postId)) {
      newIds = newIds.filter(id => id !== postId);
    } else {
      if (newIds.length >= 2) {
        alert('Chỉ được chọn tối đa 2 bài viết để xếp hạng hiển thị!');
        return;
      }
      newIds.push(postId);
    }
    set('featuredPostIds', newIds);
  };

  return (
    <div className="tab-content">
      <div className="tab-desc">
        <LayoutDashboard size={16} /> Section "Góc nhìn văn hóa" — Chọn đúng 2 bài viết bạn muốn xếp hạng đầu tiên
      </div>
      <TF label="Tiêu đề section" value={d.sectionTitle} onChange={v => set('sectionTitle', v)} placeholder="Góc Nhìn Văn Hóa" />
      
      <div className="post-selector-grid">
        <div className="post-selector-header">
          <span>Danh sách bài viết đã xuất bản</span>
          <span className="selected-count">Đã chọn: {d.featuredPostIds.length}/2</span>
        </div>
        <div className="post-list-scroll">
          {posts.map(post => {
            const isSelected = d.featuredPostIds.includes(post.id);
            const rank = d.featuredPostIds.indexOf(post.id) + 1;
            return (
              <div 
                key={post.id} 
                className={`post-select-item ${isSelected ? 'selected' : ''}`}
                onClick={() => togglePost(post.id)}
              >
                <div className="post-select-img">
                  <img src={post.imageUrl ? `http://localhost:5000${post.imageUrl}` : "https://via.placeholder.com/50"} alt="" />
                </div>
                <div className="post-select-info">
                  <div className="post-select-title">{post.title}</div>
                  <div className="post-select-meta">{post.category?.name} • {new Date(post.createdAt).toLocaleDateString()}</div>
                </div>
                {isSelected && <div className="post-rank-badge">Top {rank}</div>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="save-row">
        <button className="btn-save" onClick={() => onSave('home_culture', d)} disabled={saving}>
          <Save size={16} /> {saving ? 'Đang lưu...' : 'Lưu Xếp hạng Bài viết'}
        </button>
      </div>
    </div>
  );
};

// ======================================================
// TRANG CHÍNH
// ======================================================
const AdminHomepage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [content, setContent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetch(`${API}/api/site-content`)
      .then(r => r.json())
      .then(setContent)
      .catch(() => alert('Không thể tải nội dung!'));
  }, []);

  const handleSave = async (key, value) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/site-content/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(value),
      });
      if (res.ok) {
        setContent(prev => ({ ...prev, [key]: value }));
        setToast('✅ Đã lưu thành công! Trang chủ sẽ cập nhật ngay.');
        setTimeout(() => setToast(''), 3000);
      } else {
        alert('Lưu thất bại!');
      }
    } catch { alert('Lỗi kết nối!'); }
    finally { setSaving(false); }
  };

  const TABS = [
    { label: '① Sứ mệnh', icon: '🏮' },
    { label: '② Điểm đến', icon: '🗺️' },
    { label: '③ Đặc sản', icon: '🍜' },
    { label: '④ Xếp hạng Bài viết', icon: '⭐' },
  ];

  if (!content) return (
    <div className="admin-page"><p style={{ padding: '2rem', color: '#64748b' }}>Đang tải nội dung trang chủ...</p></div>
  );

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>🏠 Quản lý Nội dung Trang Chủ</h1>
          <p>Thay đổi text, hình ảnh và đường link của từng section — không cần chỉnh code.</p>
        </div>
        <a href="/" target="_blank" rel="noreferrer" className="btn-preview">
          👁 Xem trang chủ
        </a>
      </div>

      {toast && <div className="hp-toast">{toast}</div>}

      <div className="admin-card">
        {/* Tab headers */}
        <div className="hp-tabs">
          {TABS.map((tab, i) => (
            <button
              key={i}
              className={`hp-tab ${activeTab === i ? 'active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div>
          {activeTab === 0 && content.home_about && (
            <AboutTab data={content.home_about} onSave={handleSave} saving={saving} />
          )}
          {activeTab === 1 && content.home_destinations && (
            <DestinationsTab data={content.home_destinations} onSave={handleSave} saving={saving} />
          )}
          {activeTab === 2 && content.home_foods && (
            <FoodsTab data={content.home_foods} onSave={handleSave} saving={saving} />
          )}
          {activeTab === 3 && content.home_culture && (
            <CultureTab data={content.home_culture} onSave={handleSave} saving={saving} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHomepage;
