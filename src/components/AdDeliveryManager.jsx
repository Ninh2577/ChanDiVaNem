import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './AdDeliveryManager.css';

const API = 'http://localhost:5000';

// ============================================================
// COMPONENT CHÍNH QUẢN LÝ POPUP TOÀN SITE
// ============================================================
export const AdDeliveryManager = () => {
  const [activeAds, setActiveAds] = useState([]);
  const [currentPopup, setCurrentPopup] = useState(null); // Lưu quảng cáo popup đang hiển thị

  useEffect(() => {
    // Tải các quảng cáo đang chạy
    const fetchActiveAds = async () => {
      try {
        const res = await fetch(`${API}/api/ads/active`);
        if (res.ok) {
          const data = await res.json();
          setActiveAds(data);
        }
      } catch (err) {
        console.warn('Lỗi tải quảng cáo phân phối:', err);
      }
    };
    fetchActiveAds();
  }, []);

  useEffect(() => {
    if (activeAds.length === 0) return;

    // Lọc ra các quảng cáo dạng Popup
    const popupAds = activeAds.filter(
      ad => ad.position === 'POPUP_CENTER' || ad.position === 'POPUP_BOTTOM_RIGHT'
    );

    if (popupAds.length === 0) return;

    // Chọn ra một popup ngẫu nhiên hoặc popup đầu tiên chưa bị đóng trong session này
    const validPopup = popupAds.find(ad => !sessionStorage.getItem(`closed_ad_${ad.id}`));

    if (!validPopup) return;

    // Thiết lập hẹn giờ để hiển thị popup
    const delayMs = (validPopup.displayInterval || 5) * 1000;
    const timer = setTimeout(() => {
      setCurrentPopup(validPopup);
      
      // Ghi nhận lượt hiển thị (view count) về Backend
      fetch(`${API}/api/ads/${validPopup.id}/view`, { method: 'POST' })
        .catch(err => console.error('Lỗi track view:', err));
    }, delayMs);

    return () => clearTimeout(timer);
  }, [activeAds]);

  const handleClose = () => {
    if (currentPopup) {
      // Lưu trạng thái đã đóng trong session này để không hiển thị lại ở trang sau
      sessionStorage.setItem(`closed_ad_${currentPopup.id}`, 'true');
      setCurrentPopup(null);
    }
  };

  const handleAdClick = () => {
    if (currentPopup) {
      // Ghi nhận lượt click
      fetch(`${API}/api/ads/${currentPopup.id}/click`, { method: 'POST' })
        .catch(err => console.error('Lỗi track click:', err));

      // Mở liên kết đích trong tab mới
      window.open(currentPopup.targetUrl, '_blank', 'noopener,noreferrer');
      handleClose();
    }
  };

  if (!currentPopup) return null;

  if (currentPopup.position === 'POPUP_CENTER') {
    return (
      <div className="ad-popup-overlay">
        <div className="ad-popup-center-card">
          <button className="ad-close-btn-circle" onClick={handleClose} aria-label="Đóng quảng cáo">
            <X size={18} />
          </button>
          <img 
            src={`${API}${currentPopup.imageUrl}`} 
            alt={currentPopup.title} 
            className="ad-card-banner-img"
            onClick={handleAdClick}
          />
        </div>
      </div>
    );
  }

  if (currentPopup.position === 'POPUP_BOTTOM_RIGHT') {
    return (
      <div className="ad-popup-bottom-right-card">
        <button className="ad-close-btn-circle" onClick={handleClose} aria-label="Đóng quảng cáo">
          <X size={16} />
        </button>
        <img 
          src={`${API}${currentPopup.imageUrl}`} 
          alt={currentPopup.title} 
          className="ad-card-banner-img"
          onClick={handleAdClick}
        />
      </div>
    );
  }

  return null;
};

// ============================================================
// COMPONENT PHÂN PHÁT BANNER TĨNH DÙNG CHUNG (TOP / SIDEBAR)
// ============================================================
export const AdBanner = ({ position }) => {
  const [ad, setAd] = useState(null);
  const [closed, setClosed] = useState(false);
  const [trackedView, setTrackedView] = useState(false);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await fetch(`${API}/api/ads/active`);
        if (res.ok) {
          const data = await res.json();
          // Tìm quảng cáo đầu tiên khớp với vị trí yêu cầu
          const match = data.find(item => item.position === position);
          setAd(match || null);
        }
      } catch (err) {
        console.warn('Lỗi tải Banner quảng cáo:', err);
      }
    };
    fetchAd();
  }, [position]);

  // Track view khi banner hiển thị thực tế trên màn hình
  useEffect(() => {
    if (ad && !trackedView && !closed) {
      fetch(`${API}/api/ads/${ad.id}/view`, { method: 'POST' })
        .then(() => setTrackedView(true))
        .catch(err => console.error('Lỗi track view banner:', err));
    }
  }, [ad, trackedView, closed]);

  const handleClose = () => {
    setClosed(true);
  };

  const handleAdClick = () => {
    if (ad) {
      fetch(`${API}/api/ads/${ad.id}/click`, { method: 'POST' })
        .catch(err => console.error('Lỗi track click banner:', err));

      window.open(ad.targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (!ad || closed) return null;

  if (position === 'BANNER_TOP') {
    return (
      <div className="static-ad-banner-top">
        <div className="static-ad-banner-inner">
          <button className="static-ad-close-btn" onClick={handleClose} aria-label="Ẩn quảng cáo">
            <X size={14} />
          </button>
          <div className="static-ad-banner-link" onClick={handleAdClick} style={{ cursor: 'pointer' }}>
            <img src={`${API}${ad.imageUrl}`} alt={ad.title} />
          </div>
        </div>
      </div>
    );
  }

  if (position === 'BANNER_SIDEBAR') {
    return (
      <div className="sidebar-ad-banner-wrap">
        <button className="ad-close-btn-circle" style={{ top: '8px', right: '8px', width: '26px', height: '26px' }} onClick={handleClose} aria-label="Ẩn quảng cáo">
          <X size={14} />
        </button>
        <img 
          src={`${API}${ad.imageUrl}`} 
          alt={ad.title} 
          className="sidebar-ad-banner-img"
          onClick={handleAdClick}
        />
      </div>
    );
  }

  return null;
};
