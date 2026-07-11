import React, { useState, useEffect } from 'react';
import './Contact.css';

const API = 'http://localhost:5000';

const DEFAULT_CONTACT = {
  title: 'Góp thêm những \ncâu chuyện di sản.',
  subtitle: 'LIÊN HỆ',
  description: 'Bạn là một người say mê văn hóa, một đối tác tiềm năng, hay chỉ muốn chia sẻ cảm nhận, chúng tôi luôn lắng nghe.',
  address: 'Số 12A, Ngõ 45 Lý Nam Đế, Quận Hoàn Kiếm, Hà Nội',
  phone: '+84 (0) 24 3823 4567',
  email: 'lienhe@chandivanem.vn',
  workingHours: 'Thứ 2 - Thứ 6: 09:00 - 18:00',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0968141680517!2d105.84752837583688!3d21.028813980620315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab953357c995%3A0x1babf6f5407858f0!2zSOG7kyBIb8OgbiBLaeG6v20!5e0!3m2!1svi!2svn!4v1700000000000!5m2!1svi!2svn',
};

const Contact = () => {
  const [activeTab, setActiveTab] = useState('gop-y');
  const [data, setData] = useState(DEFAULT_CONTACT);

  useEffect(() => {
    // Tối ưu SEO cho trang Liên hệ
    document.title = "Liên hệ - Chân Đi Và Nếm | Chân Đi Và Nếm";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Kết nối với ban biên tập Chân Đi Và Nếm để chia sẻ câu chuyện, đóng góp bài viết hoặc hợp tác truyền thông phát triển văn hóa.";

    fetch(`${API}/api/site-content/page_contact`)
      .then(res => res.ok ? res.json() : null)
      .then(resData => {
        if (resData) {
          setData(prev => ({ ...prev, ...resData }));
        }
      })
      .catch(() => console.warn('Sử dụng dữ liệu Liên hệ mặc định.'));
  }, []);

  return (
    <div className="contact-page">
      <div className="contact-layout">
        
        {/* Sidebar */}
        <aside className="contact-sidebar">
          <div className="sidebar-header">
            <h3>Khám Phá Thêm</h3>
            <p>Góc nhìn đa chiều về di sản</p>
          </div>
          <nav className="sidebar-nav">
            <button 
              className={`sidebar-link ${activeTab === 'chuyen-nghe' ? 'active' : ''}`}
              onClick={() => setActiveTab('chuyen-nghe')}
            >
              <span className="icon">📰</span> Chuyện Nghề
            </button>
            <button 
              className={`sidebar-link ${activeTab === 'hau-truong' ? 'active' : ''}`}
              onClick={() => setActiveTab('hau-truong')}
            >
              <span className="icon">📷</span> Hậu Trường
            </button>
            <button 
              className={`sidebar-link ${activeTab === 'doi-tac' ? 'active' : ''}`}
              onClick={() => setActiveTab('doi-tac')}
            >
              <span className="icon">🤝</span> Đối Tác
            </button>
            <button 
              className={`sidebar-link ${activeTab === 'gop-y' ? 'active' : ''}`}
              onClick={() => setActiveTab('gop-y')}
            >
              <span className="icon">✉️</span> Góp Ý
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="contact-main">
          
          {/* TAB: GÓP Ý (Default Contact) */}
          {activeTab === 'gop-y' && (
            <>
              <section className="contact-hero">
                <div className="hero-text animate-fade">
                  <span className="about-tag" style={{ display: 'inline-block', marginBottom: '0.5rem', color: '#9e3322', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.05em' }}>{data.subtitle}</span>
                  <h1>
                    {data.title?.split('\n').map((line, i) => (
                      <span key={i}>{i === 1 ? <span className="highlight-italic">{line}</span> : line}{i < data.title.split('\n').length - 1 && <br />}</span>
                    ))}
                  </h1>
                  <p>{data.description}</p>
                </div>
                <div className="hero-image">
                  <img src="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=800" alt="Cafe and culture" />
                </div>
              </section>

              <section className="contact-content-split">
                <div className="form-area">
                  <h2>Gửi Lời Nhắn</h2>
                  <form className="contact-form" onSubmit={e => { e.preventDefault(); alert('Cảm ơn bạn đã đóng góp ý kiến!'); }}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>HỌ TÊN</label>
                        <input type="text" placeholder="Nguyễn Văn A" required />
                      </div>
                      <div className="form-group">
                        <label>EMAIL</label>
                        <input type="email" placeholder="example@email.com" required />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>CHỦ ĐỀ</label>
                      <div className="select-wrapper">
                        <select>
                          <option>Góp ý nội dung</option>
                          <option>Báo cáo lỗi</option>
                          <option>Khác</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>LỜI NHẮN</label>
                      <textarea rows="5" placeholder="Chia sẻ suy nghĩ của bạn cùng chúng tôi..." required></textarea>
                    </div>

                    <button type="submit" className="btn-submit">Gửi Lời Nhắn <span>➢</span></button>
                  </form>
                </div>

                <div className="info-area">
                  <div className="info-card light-card">
                    <div className="info-item">
                      <div className="info-icon">📍</div>
                      <div className="info-text">
                        <h4>Địa Chỉ Văn Phòng</h4>
                        <p>{data.address}</p>
                      </div>
                    </div>
                    
                    <div className="info-item">
                      <div className="info-icon">📞</div>
                      <div className="info-text">
                        <h4>Điện Thoại</h4>
                        <p>{data.phone}<br/>{data.workingHours}</p>
                      </div>
                    </div>
                    
                    <div className="info-item">
                      <div className="info-icon">📧</div>
                      <div className="info-text">
                        <h4>Email Hỗ Trợ</h4>
                        <p>{data.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {data.mapEmbedUrl && (
                <section className="contact-map-section animate-fade" style={{ marginTop: '3rem', width: '100%', height: '400px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <iframe 
                    src={data.mapEmbedUrl}
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Bản đồ văn phòng Chân Đi Và Nếm"
                  ></iframe>
                </section>
              )}
            </>
          )}

          {/* TAB: CHUYỆN NGHỀ */}
          {activeTab === 'chuyen-nghe' && (
            <div className="tab-content-area animate-fade">
              <section className="contact-hero" style={{ paddingBottom: '2rem' }}>
                <div className="hero-text">
                  <h1>Ghi chép từ <br/><span className="highlight-italic">những nẻo đường</span></h1>
                  <p>Lắng nghe tâm sự của đội ngũ tác giả, những người đã đánh đổi mồ hôi và những đêm thức trắng để giữ lại từng nét chữ, khung hình cho di sản.</p>
                </div>
                <div className="hero-image">
                  <img src="https://images.unsplash.com/photo-1455390582262-044cdead2708?auto=format&fit=crop&q=80&w=800" alt="Writing" />
                </div>
              </section>
              
              <div className="story-grid">
                <div className="story-card">
                  <span className="date">12 Tháng 5, 2024</span>
                  <h3>Bức ảnh đánh đổi bằng 3 ngày leo núi</h3>
                  <p>Câu chuyện đằng sau bức ảnh sương mù Mù Cang Chải đạt giải nhất của tác giả Nam Nguyễn.</p>
                  <a href="#">Đọc thêm →</a>
                </div>
                <div className="story-card">
                  <span className="date">08 Tháng 4, 2024</span>
                  <h3>Giữ lửa làng nghề: Không chỉ là đam mê</h3>
                  <p>Tâm sự của Minh Anh khi phải chứng kiến sự mai một của các xưởng làm lụa truyền thống.</p>
                  <a href="#">Đọc thêm →</a>
                </div>
              </div>
            </div>
          )}

          {/* TAB: HẬU TRƯỜNG */}
          {activeTab === 'hau-truong' && (
            <div className="tab-content-area animate-fade">
              <div className="hero-text" style={{ marginBottom: '3rem' }}>
                <h1>Sau ống kính <br/><span className="highlight-italic">là nụ cười</span></h1>
                <p>Những khoảnh khắc chân thực, ngẫu hứng và không kém phần vất vả của ekip thực hiện "CHÂN ĐI VÀ NẾM" tại các bản làng xa xôi.</p>
              </div>

              <div className="gallery-masonry">
                <img src="https://images.unsplash.com/photo-1516646255117-f9f933680173?auto=format&fit=crop&q=80&w=600" alt="Behind scene 1" className="masonry-img" />
                <img src="https://images.unsplash.com/photo-1544078751-58fee26f4bc7?auto=format&fit=crop&q=80&w=600" alt="Behind scene 2" className="masonry-img" />
                <img src="https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80&w=600" alt="Behind scene 3" className="masonry-img" />
              </div>
            </div>
          )}

          {/* TAB: ĐỐI TÁC */}
          {activeTab === 'doi-tac' && (
            <div className="tab-content-area animate-fade">
              <section className="contact-hero" style={{ paddingBottom: '2rem' }}>
                <div className="hero-text">
                  <h1>Cùng nhau <br/><span className="highlight-italic">kiến tạo giá trị</span></h1>
                  <p>Chúng tôi luôn chào đón các thương hiệu, tổng cục du lịch và các nhà tài trợ cùng chung tầm nhìn bảo tồn và phát huy văn hóa Việt.</p>
                </div>
                <div className="hero-image">
                  <img src="https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&q=80&w=800" alt="Partnership" />
                </div>
              </section>

              <section className="contact-content-split">
                <div className="form-area">
                  <h2>Đăng ký Hợp tác</h2>
                  <form className="contact-form" onSubmit={e => { e.preventDefault(); alert('Cảm ơn bạn! Đăng ký hợp tác đã gửi thành công.'); }}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>TÊN CÔNG TY / THƯƠNG HIỆU</label>
                        <input type="text" placeholder="Tên doanh nghiệp của bạn" required />
                      </div>
                      <div className="form-group">
                        <label>EMAIL DOANH NGHIỆP</label>
                        <input type="email" placeholder="contact@company.com" required />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>HÌNH THỨC HỢP TÁC</label>
                      <div className="select-wrapper">
                        <select>
                          <option>Tài trợ chuyên mục</option>
                          <option>Quảng cáo Banner</option>
                          <option>Tổ chức sự kiện</option>
                          <option>Khác</option>
                        </select>
                      </div>
                    </div>

                    <button type="submit" className="btn-submit">Gửi Yêu Cầu <span>➢</span></button>
                  </form>
                </div>

                <div className="info-area">
                  <div className="info-card brown-card" style={{ height: '100%' }}>
                    <div className="brown-card-bg"></div>
                    <h4>Tại sao chọn chúng tôi?</h4>
                    <ul style={{ color: 'rgba(255,255,255,0.8)', paddingLeft: '1.5rem', marginTop: '1rem', lineHeight: '1.8' }}>
                      <li>Tiếp cận hơn 100,000 độc giả trung thành yêu văn hóa.</li>
                      <li>Nội dung chất lượng cao, hình ảnh độc quyền.</li>
                      <li>Uy tín thương hiệu gắn liền với giá trị di sản.</li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Contact;
