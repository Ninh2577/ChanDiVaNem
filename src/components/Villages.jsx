import React from 'react';

const Villages = () => {
  return (
    <section className="villages">
      <div className="container">
        <div className="villages-grid">
          <div className="village-image">
            <img src="https://images.unsplash.com/photo-1516646255117-f9f933680173?auto=format&fit=crop&q=80&w=800" alt="Gốm Bát Tràng" />
          </div>
          <div className="village-content">
            <span className="section-tag">DI SẢN NĂM THÁNG VIỆT</span>
            <h2>Làng nghề nghìn<br/>năm tuổi</h2>
            
            <div className="village-list">
              <div className="village-item">
                <h3>Gốm Bát Tràng</h3>
                <p>Nơi đất sét biến thành nghệ thuật qua đôi bàn tay khéo léo của thợ làng. Mỗi sản phẩm là một câu chuyện về truyền thống và sự sáng tạo không ngừng.</p>
              </div>
              
              <div className="village-item">
                <h3>Lụa Vạn Phúc</h3>
                <p>Mềm mại như dải lụa mây trôi. Lụa Hà Đông từ lâu đã trở thành biểu tượng của vẻ đẹp truyền thống, tinh tế của người phụ nữ Việt Nam.</p>
              </div>
              
              <div className="village-item">
                <h3>Nón Lá Chuông</h3>
                <p>Chiếc nón trắng tinh khôi, che nắng che mưa, đã đi vào thơ ca nhạc họa như một biểu tượng văn hóa bất hủ của dân tộc.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Villages;
