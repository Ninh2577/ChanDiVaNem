import React from 'react';
import './Privacy.css';

const Privacy = () => {
  return (
    <div className="privacy-page">
      <div className="privacy-layout">
        
        {/* Sidebar */}
        <aside className="privacy-sidebar">
          <div className="sidebar-header">
            <h3>Khám Phá Thêm</h3>
            <p>Góc nhìn đa chiều về di sản</p>
          </div>
          <nav className="sidebar-nav">
            <a href="#" className="sidebar-link">
              <span className="icon">📰</span> Chuyện Nghề
            </a>
            <a href="#" className="sidebar-link">
              <span className="icon">📷</span> Hậu Trường
            </a>
            <a href="#" className="sidebar-link">
              <span className="icon">🤝</span> Đối Tác
            </a>
            <a href="/contact" className="sidebar-link">
              <span className="icon">✉️</span> Góp Ý
            </a>
          </nav>
          <div className="sidebar-date">
            CẬP NHẬT LÚC<br/>
            <span style={{textTransform: 'none', color: 'var(--text-dark)', marginTop: '0.3rem', display: 'block'}}>24 Tháng 05, 2024</span>
          </div>
        </aside>

        {/* Main Content */}
        <main className="privacy-main">
          
          {/* Hero Section */}
          <section className="privacy-hero">
            <span className="privacy-tag">PHÁP LÝ & SỰ RIÊNG TƯ</span>
            <h1>Chính Sách Bảo Mật</h1>
            <p className="privacy-intro">Tại CHÂN ĐI VÀ NẾM, chúng tôi trân trọng sự tin tưởng của bạn cũng như cách chúng tôi gìn giữ những giá trị di sản. Sự riêng tư của bạn là ưu tiên hàng đầu trong mọi hành trình chúng ta cùng sẻ chia.</p>
          </section>

          {/* Block 1 */}
          <section className="privacy-block">
            <div className="block-left">
              <h3 className="block-title title-red">Thu thập thông tin</h3>
            </div>
            <div className="block-right">
              <p>Chúng tôi thu thập thông tin để mang đến cho bạn những trải nghiệm cá nhân hóa sâu sắc hơn trong hành trình khám phá văn hóa và ẩm thực:</p>
              <ul className="numbered-list">
                <li>
                  <span className="num">01.</span>
                  <p><strong>Thông tin định danh:</strong> Họ tên, địa chỉ email khi bạn đăng ký nhận bản tin hoặc tham gia cộng đồng.</p>
                </li>
                <li>
                  <span className="num">02.</span>
                  <p><strong>Dữ liệu tương tác:</strong> Cách bạn khám phá các bài viết, thời gian lưu lại trên các trang chuyên đề văn hóa.</p>
                </li>
                <li>
                  <span className="num">03.</span>
                  <p><strong>Cookie & Công nghệ theo dõi:</strong> Để ghi nhớ sở thích vùng miền và khẩu vị ẩm thực bạn quan tâm.</p>
                </li>
              </ul>
            </div>
          </section>

          {/* Image Break */}
          <div className="privacy-image-break">
            <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1200" alt="Hoi An Lanterns" />
            <div className="img-overlay-text">
              <p>"Gìn giữ hồn Việt không chỉ là câu chuyện về di sản, mà còn là sự tôn trọng quyền riêng tư của mỗi cá nhân."</p>
            </div>
          </div>

          {/* Block 2 */}
          <section className="privacy-block align-start">
            <div className="block-left">
              <h3 className="block-title icon-title"><span className="red-icon">»</span> Sử dụng thông tin</h3>
            </div>
            <div className="block-right">
              <div className="grey-panel">
                <p>Thông tin của bạn được sử dụng một cách minh bạch cho các mục đích:</p>
                <div className="usage-grid">
                  <div className="usage-card">
                    <h4>Cá nhân hóa nội dung</h4>
                    <p>Gợi ý những hành trình và món ăn phù hợp với sở thích của bạn.</p>
                  </div>
                  <div className="usage-card">
                    <h4>Cải thiện dịch vụ</h4>
                    <p>Phân tích xu hướng để tối ưu hóa giao diện và nội dung biên tập.</p>
                  </div>
                  <div className="usage-card">
                    <h4>Truyền thông</h4>
                    <p>Gửi bản tin định kỳ về các sự kiện văn hóa và ưu đãi từ đối tác.</p>
                  </div>
                  <div className="usage-card">
                    <h4>An toàn hệ thống</h4>
                    <p>Ngăn chặn các hành vi xâm nhập trái phép và bảo vệ cộng đồng.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Block 3 */}
          <section className="privacy-block align-start">
            <div className="block-left">
              <h3 className="block-title icon-title"><span className="red-icon">🛡️</span> Cam kết bảo mật</h3>
            </div>
            <div className="block-right">
              <p>Chúng tôi áp dụng những tiêu chuẩn bảo mật nghiêm ngặt nhất để bảo vệ dữ liệu của bạn:</p>
              <ul className="check-list">
                <li>
                  <span className="check-icon">✅</span>
                  <div>
                    <h4>Mã hóa đầu cuối</h4>
                    <p>Mọi dữ liệu truyền tải đều được mã hóa theo tiêu chuẩn SSL cao nhất.</p>
                  </div>
                </li>
                <li>
                  <span className="check-icon">✅</span>
                  <div>
                    <h4>Không chia sẻ bên thứ ba</h4>
                    <p>Chúng tôi tuyệt đối không bán hay trao đổi thông tin của bạn cho bất kỳ đơn vị quảng cáo nào.</p>
                  </div>
                </li>
                <li>
                  <span className="check-icon">✅</span>
                  <div>
                    <h4>Kiểm soát truy cập</h4>
                    <p>Chỉ những nhân sự có thẩm quyền mới được phép tiếp cận dữ liệu khách hàng.</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* Block 4 */}
          <section className="privacy-block align-start">
            <div className="block-left">
              <h3 className="block-title icon-title"><span className="red-icon">⚖️</span> Quyền lợi của bạn</h3>
            </div>
            <div className="block-right">
              <p>Bạn luôn có toàn quyền kiểm soát dữ liệu cá nhân của mình trên hệ thống của CHÂN ĐI VÀ NẾM:</p>
              <div className="rights-list">
                <div className="right-pill">
                  <span className="red-icon">⇌</span> Quyền truy cập và điều chỉnh thông tin cá nhân
                </div>
                <div className="right-pill">
                  <span className="red-icon">✉</span> Quyền từ chối nhận thông tin tiếp thị
                </div>
                <div className="right-pill">
                  <span className="red-icon">🗑️</span> Quyền yêu cầu xóa bỏ hoàn toàn dữ liệu
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="privacy-cta">
            <h2>Cần hỗ trợ thêm về bảo mật?</h2>
            <p>Nếu bạn có bất kỳ câu hỏi nào về các điều khoản bảo mật của chúng tôi, đừng ngần ngại liên hệ với đội ngũ pháp lý.</p>
            <button className="btn-white">Gửi Email Yêu Cầu</button>
          </section>

        </main>
      </div>
    </div>
  );
};

export default Privacy;
