import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import './SearchResults.css';

const decodeHtmlEntities = (str) => {
  if (!str) return '';
  return str
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true);
      if (query.trim().length > 0) {
        try {
          const res = await fetch(`http://localhost:5000/api/posts/search/query?q=${encodeURIComponent(query)}`);
          if (res.ok) {
            const data = await res.json();
            setResults(data);
          } else {
            setResults([]);
          }
        } catch (error) {
          console.error('Lỗi khi tìm kiếm bài viết:', error);
          setResults([]);
        }
      } else {
        setResults([]);
      }
      setIsLoading(false);
    };

    fetchSearchResults();
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
                  <img src={post.imageUrl ? `http://localhost:5000${post.imageUrl}` : 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&q=80&w=800'} alt={post.title} />
                  <span className="result-category">{post.category?.name}</span>
                </div>
                <div className="result-content">
                  <h3><Link to={`/post/${post.slug}`}>{post.title}</Link></h3>
                  <p>{decodeHtmlEntities(post.excerpt)}</p>
                  <Link to={`/post/${post.slug}`} className="read-more">Đọc tiếp →</Link>
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
