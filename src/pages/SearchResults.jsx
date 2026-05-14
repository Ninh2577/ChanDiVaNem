import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Simulate API search call
    const timer = window.setTimeout(() => {
      setIsLoading(true);
      // Mock data for search
      if (query.trim().length > 0) {
        setResults([
          {
            id: 1,
            title: `Khám phá vẻ đẹp của ${query}`,
            excerpt: `Những điều thú vị và bất ngờ đang chờ đón bạn khi khám phá ${query} qua lăng kính của những người đam mê xê dịch.`,
            category: 'Điểm Đến',
            image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&q=80&w=800'
          },
          {
            id: 2,
            title: `Câu chuyện văn hóa đằng sau ${query}`,
            excerpt: `Một góc nhìn sâu sắc hơn về nét đẹp truyền thống và những giá trị cốt lõi làm nên sức hút của ${query}.`,
            category: 'Văn Hóa',
            image: 'https://images.unsplash.com/photo-1544078751-58fee26f4bc7?auto=format&fit=crop&q=80&w=800'
          }
        ]);
      } else {
        setResults([]);
      }
      setIsLoading(false);
    }, 800);

    return () => window.clearTimeout(timer);
  }, [query]);

  return (
    <div className="search-results-page">
      <div className="search-header">
        <div className="container">
          <h1>Kết Quả Tìm Kiếm</h1>
          <p>Hiển thị kết quả cho từ khóa: <strong>"{query}"</strong></p>
        </div>
      </div>

      <div className="container results-container">
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang tìm kiếm...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="results-grid">
            {results.map(post => (
              <div key={post.id} className="result-card">
                <div className="result-img">
                  <img src={post.image} alt={post.title} />
                  <span className="result-category">{post.category}</span>
                </div>
                <div className="result-content">
                  <h3><Link to="/post/demo-slug">{post.title}</Link></h3>
                  <p>{post.excerpt}</p>
                  <Link to="/post/demo-slug" className="read-more">Đọc tiếp →</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <Search size={48} className="no-results-icon" />
            <h2>Không tìm thấy kết quả phù hợp</h2>
            <p>Rất tiếc, chúng tôi không thể tìm thấy bài viết nào cho từ khóa "{query}".</p>
            <p>Vui lòng thử lại với các từ khóa khác phổ biến hơn hoặc kiểm tra lỗi chính tả.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
