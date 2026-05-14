import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Save, Send, Image as ImageIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import './CreatePost.css';

const CreatePost = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Nếu có id thì là chế độ Sửa (Edit)
  const isEditMode = !!id;

  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [thumbnailAlt, setThumbnailAlt] = useState('');
  
  // SEO States
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(isEditMode);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Lấy danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Lỗi lấy danh mục:', error);
      }
    };
    fetchCategories();
  }, []);

  // Nếu ở chế độ Sửa, lấy dữ liệu bài viết cũ
  useEffect(() => {
    if (isEditMode) {
      const fetchPostDetails = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/posts/detail/${id}`);
          if (res.ok) {
            const data = await res.json();
            setTitle(data.title);
            setContent(data.content);
            setCategoryId(data.categoryId || '');
            setImageUrl(data.imageUrl || '');
            setThumbnailAlt(data.thumbnailAlt || '');
            // SEO
            setMetaTitle(data.metaTitle || '');
            setMetaDesc(data.metaDesc || '');
            setCanonicalUrl(data.canonicalUrl || '');
            setCustomSlug(data.slug || ''); // Slug hiện tại
          } else {
            alert('Không tìm thấy bài viết để sửa!');
            navigate(-1);
          }
        } catch (error) {
          console.error('Lỗi lấy dữ liệu bài viết:', error);
        } finally {
          setIsLoadingPost(false);
        }
      };
      fetchPostDetails();
    }
  }, [id, isEditMode, navigate]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setIsUploadingImage(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      if (res.ok) {
        const data = await res.json();
        setImageUrl(data.imageUrl); // e.g., /uploads/12345.jpg
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Lỗi tải ảnh lên.');
      }
    } catch (error) {
      console.error('Lỗi upload ảnh:', error);
      alert('Không thể kết nối máy chủ để tải ảnh.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [2, 3, 4, false] }], // SEO: Focus H2, H3 (H1 là title ngoài)
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const handleSaveDraft = () => {
    alert('Đã lưu bản nháp thành công!');
  };

  const handleSubmit = async () => {
    if(!title || !content || !categoryId) {
      alert('Vui lòng nhập đủ Tiêu đề, Nội dung và Chọn chuyên mục!');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const url = isEditMode ? `http://localhost:5000/api/posts/${id}` : 'http://localhost:5000/api/posts';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          content,
          categoryId,
          imageUrl,
          thumbnailAlt,
          metaTitle,
          metaDesc,
          canonicalUrl,
          customSlug,
          slug: customSlug // Cho update
        })
      });

      if (response.ok) {
        alert(isEditMode ? 'Cập nhật bài viết thành công!' : 'Đã gửi bài viết lên hệ thống chờ duyệt!');
        
        // Quay về danh sách bài viết tương ứng với quyền (Admin hoặc CTV)
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.role === 'ADMIN') {
          navigate('/admin/posts');
        } else {
          navigate('/ctv/my-posts');
        }
      } else {
        alert('Có lỗi xảy ra khi lưu bài viết.');
      }
    } catch {
      alert('Không thể kết nối đến máy chủ Backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingPost) {
    return <div className="admin-page"><p style={{padding: '2rem'}}>Đang tải dữ liệu bài viết...</p></div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>{isEditMode ? 'Chỉnh Sửa Bài Viết' : 'Viết Bài Mới'}</h1>
          <p>{isEditMode ? 'Chỉnh sửa nội dung và định dạng bài viết hiện tại.' : 'Tạo nội dung bài viết và định dạng với trình soạn thảo trực quan.'}</p>
        </div>
        <div className="editor-actions">
          <button className="btn-outline" onClick={handleSaveDraft}>
            <Save size={18} /> Lưu Nháp
          </button>
          <button className="btn-primary" style={{ backgroundColor: '#10b981' }} onClick={handleSubmit} disabled={isSubmitting}>
            <Send size={18} /> {isSubmitting ? 'Đang gửi...' : (isEditMode ? 'Cập nhật' : 'Gửi Duyệt')}
          </button>
        </div>
      </div>

      <div className="editor-layout">
        {/* Main Editor */}
        <div className="editor-main">
          <div className="admin-card">
            <div className="admin-card-body">
              <input 
                type="text" 
                className="editor-title-input" 
                placeholder="Nhập tiêu đề bài viết..." 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              
              <div className="quill-wrapper">
                <ReactQuill 
                  theme="snow" 
                  value={content} 
                  onChange={setContent} 
                  modules={modules}
                  placeholder="Bắt đầu viết câu chuyện của bạn ở đây..."
                />
              </div>
            </div>
          </div>

          {/* SEO Configuration Section */}
          <div className="admin-card mt-4">
            <div className="admin-card-header">
              <h3 style={{ fontSize: '1rem', color: '#1e293b' }}>Cấu hình SEO Kỹ thuật (Phần chìm)</h3>
            </div>
            <div className="admin-card-body">
              <div className="seo-grid">
                <div className="form-group-p">
                  <label>Thẻ Title SEO (Tiêu đề Google)</label>
                  <div className="input-with-counter">
                    <input 
                      type="text" 
                      className="editor-input" 
                      placeholder="Nhập tiêu đề SEO..." 
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      maxLength={60}
                    />
                    <span className={`counter ${metaTitle.length > 55 ? 'warning' : ''}`}>{metaTitle.length}/60</span>
                  </div>
                  <p className="field-hint">Tiêu đề xuất hiện trên kết quả tìm kiếm Google. Nên dưới 60 ký tự.</p>
                </div>

                <div className="form-group-p mt-4">
                  <label>Đường dẫn bài viết (URL Slug)</label>
                  <div className="slug-input-wrapper">
                    <span className="slug-prefix">.../post/</span>
                    <input 
                      type="text" 
                      className="editor-input" 
                      placeholder="ví dụ: huong-dan-seo-bai-viet" 
                      value={customSlug}
                      onChange={(e) => setCustomSlug(e.target.value)}
                    />
                  </div>
                  <p className="field-hint">Đường dẫn không dấu, ngăn cách bằng dấu gạch ngang.</p>
                </div>

                <div className="form-group-p mt-4">
                  <label>Thẻ Meta Description (Mô tả tóm tắt)</label>
                  <div className="input-with-counter">
                    <textarea 
                      className="editor-input" 
                      style={{ height: '80px', paddingTop: '0.75rem' }}
                      placeholder="Nhập đoạn mô tả ngắn gọn thu hút người dùng..." 
                      value={metaDesc}
                      onChange={(e) => setMetaDesc(e.target.value)}
                      maxLength={160}
                    ></textarea>
                    <span className={`counter ${metaDesc.length > 150 ? 'warning' : ''}`}>{metaDesc.length}/160</span>
                  </div>
                  <p className="field-hint">Tóm tắt nội dung bài viết, xuất hiện dưới tiêu đề trên Google.</p>
                </div>

                <div className="form-group-p mt-4">
                  <label>Thẻ Canonical URL (Link gốc)</label>
                  <input 
                    type="text" 
                    className="editor-input" 
                    placeholder="https://domain.com/bai-viet-goc" 
                    value={canonicalUrl}
                    onChange={(e) => setCanonicalUrl(e.target.value)}
                  />
                  <p className="field-hint">Dùng khi bạn copy bài từ nguồn khác để tránh bị Google phạt trùng lặp.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="editor-sidebar">
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>Cài Đặt Bài Viết</h3>
            </div>
            <div className="admin-card-body">
              
              <div className="form-group-p">
                <label>Chuyên mục</label>
                <select className="editor-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                  <option value="">-- Chọn chuyên mục --</option>
                  {/* Render hierarchical categories */}
                  {categories.filter(cat => !cat.parentId).map(parent => (
                    <React.Fragment key={parent.id}>
                      <option value={parent.id} style={{ fontWeight: 'bold' }}>{parent.name}</option>
                      {categories.filter(child => child.parentId === parent.id).map(child => (
                        <option key={child.id} value={child.id}>
                          &nbsp;&nbsp;— {child.name}
                        </option>
                      ))}
                    </React.Fragment>
                  ))}
                  {/* Fallback for categories without parent/children structure if any */}
                  {categories.filter(cat => !cat.parentId && !categories.some(c => c.parentId === cat.id)).length === 0 && 
                    categories.length > 0 && categories.every(c => !c.parentId) && 
                    categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)
                  }
                </select>
              </div>

              <div className="form-group-p mt-4">
                <label>Thẻ (Tags)</label>
                <input type="text" className="editor-input" placeholder="Ví dụ: Hội An, Cà Phê..." />
              </div>

              <div className="form-group-p mt-4">
                <label>Ảnh đại diện (Thumbnail)</label>
                <div className="upload-box" style={{ position: 'relative', overflow: 'hidden', marginBottom: '1rem' }}>
                  {imageUrl ? (
                    <>
                      <img src={`http://localhost:5000${imageUrl}`} alt="Thumbnail preview" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
                      <div className="upload-box-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', opacity: 0, transition: 'opacity 0.2s', zIndex: 5 }} onMouseEnter={(e) => e.currentTarget.style.opacity=1} onMouseLeave={(e) => e.currentTarget.style.opacity=0}>
                         Bấm để đổi ảnh
                      </div>
                    </>
                  ) : (
                    <>
                      <ImageIcon size={32} color={isUploadingImage ? "#10b981" : "#94a3b8"} />
                      <span>{isUploadingImage ? 'Đang tải lên...' : 'Kéo thả ảnh vào đây'}</span>
                      <span>{!isUploadingImage && 'hoặc click để tải lên'}</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    accept="image/png, image/jpeg, image/webp" 
                    onChange={handleImageUpload} 
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10 }} 
                    title="Chọn ảnh để tải lên"
                  />
                </div>
                
                <label style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>Alt Text (Mô tả ảnh cho Google)</label>
                <input 
                  type="text" 
                  className="editor-input" 
                  placeholder="ví dụ: Cảnh đẹp Tây Bắc sáng sớm" 
                  value={thumbnailAlt}
                  onChange={(e) => setThumbnailAlt(e.target.value)}
                  style={{ fontSize: '0.85rem' }}
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
