import React from 'react';

const PeopleLife = () => {
  return (
    <section className="people-life">
      <div className="container">
        <div className="text-center">
          <h2>Con người & Đời sống</h2>
          <p className="quote-text">"Cái hồn của văn hóa nằm ở những nụ cười tỏa nắng và đôi bàn tay lao động cần mẫn."</p>
        </div>
        
        <div className="gallery-grid">
          <div className="gallery-main">
            <img src="https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80&w=800" alt="Con người" />
          </div>
          <div className="gallery-right">
            <div className="gallery-top">
              <img src="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=800" alt="Đời sống trên sông" />
            </div>
            <div className="gallery-bottom">
              <img src="https://images.unsplash.com/photo-1583417646194-672589255ce4?auto=format&fit=crop&q=80&w=600" alt="Phố cổ" />
              <img src="https://images.unsplash.com/photo-1600007283728-22aba3e1d6d8?auto=format&fit=crop&q=80&w=600" alt="Tâm linh" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PeopleLife;
