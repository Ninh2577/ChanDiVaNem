import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import './SearchModal.css';

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
      setQuery('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay">
      <div className="search-modal-backdrop" onClick={onClose}></div>
      <div className="search-modal-content animate-slide-down">
        <button className="search-close-btn" onClick={onClose} aria-label="Close search">
          <X size={24} />
        </button>
        <div className="search-modal-container">
          <h2>Bạn muốn tìm kiếm điều gì?</h2>
          <form className="search-modal-form" onSubmit={handleSearch}>
            <Search className="search-modal-icon" size={24} />
            <input 
              type="text" 
              placeholder="Nhập từ khóa về bài viết, địa điểm, ẩm thực..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <button type="submit" className="search-modal-submit">Tìm Kiếm</button>
          </form>
          <div className="search-suggestions">
            <span>Gợi ý:</span>
            <button onClick={() => setQuery('Hội An')}>Hội An</button>
            <button onClick={() => setQuery('Phở Hà Nội')}>Phở Hà Nội</button>
            <button onClick={() => setQuery('Tết Nguyên Đán')}>Tết Nguyên Đán</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
