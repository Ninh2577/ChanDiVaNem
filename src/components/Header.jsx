import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Search, Bookmark, Menu, X, ChevronDown } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import SearchModal from './SearchModal';
import './Header.css';

// Render icon động từ tên Lucide
const DynIcon = ({ name, ...props }) => {
  if (!name) return null;
  const Comp = LucideIcons[name];
  return Comp ? <Comp {...props} /> : null;
};

// Default fallback menu
const DEFAULT_NAV = [
  { id: 1, label: 'Trang Chủ', path: '/', order: 1, isActive: true, children: [] },
  { id: 2, label: 'Điểm Đến', path: '/destinations', order: 2, isActive: true, children: [] },
  { id: 3, label: 'Ẩm Thực', path: '/cuisine', order: 3, isActive: true, children: [] },
  { id: 4, label: 'Văn Hóa', path: '/culture', order: 4, isActive: true, children: [] },
  { id: 5, label: 'Góc Chia Sẻ', path: '/blog', order: 5, isActive: true, children: [] },
  { id: 6, label: 'Liên Hệ', path: '/contact', order: 6, isActive: true, children: [] },
  { id: 7, label: 'Về Chúng Tôi', path: '/about', order: 7, isActive: true, children: [] },
];

// ============================================================
// Flyout cấp 2+ (xuất hiện bên phải)
// ============================================================
const FlyoutMenu = ({ items }) => {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="flyout-panel">
      {items.map(item => (
        <div
          key={item.id}
          className="flyout-item-wrap"
          onMouseEnter={() => setHovered(item.id)}
          onMouseLeave={() => setHovered(null)}
        >
          <Link to={item.path} className={`flyout-item ${!item.isActive ? 'hidden-item' : ''}`}>
            {item.icon && <DynIcon name={item.icon} size={15} className="flyout-icon" />}
            <span>{item.label}</span>
            {item.children?.length > 0 && <ChevronDown size={12} className="flyout-arrow" />}
          </Link>
          {/* Cấp tiếp theo (đệ quy) */}
          {item.children?.length > 0 && hovered === item.id && (
            <div className="flyout-nested">
              <FlyoutMenu items={item.children.filter(c => c.isActive)} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ============================================================
// Mega Menu (cấp 1 → cấp 2) — Panel rộng, nhiều cột
// ============================================================
const MegaMenu = ({ children, parentPath }) => {
  const activeChildren = children.filter(c => c.isActive);
  const COLS = Math.min(activeChildren.length, 4);

  return (
    <div className="mega-menu-panel" style={{ '--cols': COLS }}>
      <div className="mega-menu-grid">
        {activeChildren.map(item => (
          <div key={item.id} className="mega-col">
            <Link to={item.path} className="mega-col-header">
              {item.imageUrl && (
                <img
                  src={`http://localhost:5000${item.imageUrl}`}
                  alt={item.label}
                  className="mega-col-img"
                />
              )}
              <div className="mega-col-meta">
                {item.icon && <DynIcon name={item.icon} size={16} className="mega-col-icon" />}
                <span className="mega-col-label">{item.label}</span>
                {item.children?.length > 0 && <ChevronDown size={12} className="mega-has-sub" />}
              </div>
              {item.description && <p className="mega-col-desc">{item.description}</p>}
            </Link>
            {/* Sub-links bên trong cột */}
            {item.children?.length > 0 && (
              <div className="mega-sub-links">
                {item.children.filter(c => c.isActive).map(sub => (
                  <Link key={sub.id} to={sub.path} className="mega-sub-link">
                    {sub.icon && <DynIcon name={sub.icon} size={13} />}
                    {sub.label}
                    {sub.children?.length > 0 && ' ›'}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mega-footer">
        <Link to={parentPath} className="mega-view-all">
          Xem tất cả →
        </Link>
      </div>
    </div>
  );
};

// ============================================================
// Mobile Accordion Item (đệ quy)
// ============================================================
const MobileAccordionItem = ({ item, depth = 0, onClose }) => {
  const [open, setOpen] = useState(false);
  const hasChildren = item.children?.length > 0;

  return (
    <div className="mob-accordion-item">
      <div className="mob-row" style={{ paddingLeft: `${1 + depth * 1}rem` }}>
        <Link
          to={item.path}
          className="mob-label"
          onClick={!hasChildren ? onClose : undefined}
        >
          {item.icon && <DynIcon name={item.icon} size={15} />}
          {item.label}
        </Link>
        {hasChildren && (
          <button className="mob-toggle" onClick={() => setOpen(!open)}>
            <ChevronDown size={16} className={open ? 'rotated' : ''} />
          </button>
        )}
      </div>
      {hasChildren && open && (
        <div className="mob-children">
          {item.children.filter(c => c.isActive).map(child => (
            <MobileAccordionItem key={child.id} item={child} depth={depth + 1} onClose={onClose} />
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================
// Header chính
// ============================================================
const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [navItems, setNavItems] = useState(DEFAULT_NAV);
  const [activeMenu, setActiveMenu] = useState(null);
  const closeTimer = useRef(null);

  const fetchNavigation = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/navigation');
      if (res.ok) {
        const data = await res.json();
        const active = data.filter(i => i.isActive);
        if (active.length > 0) setNavItems(active);
      }
    } catch {
      console.warn('Dùng menu mặc định.');
    }
  };

  useEffect(() => {
    const initialFetchId = window.setTimeout(() => {
      void fetchNavigation();
    }, 0);
    const onUpdate = () => {
      void fetchNavigation();
    };
    window.addEventListener('navigation-updated', onUpdate);
    return () => {
      window.clearTimeout(initialFetchId);
      window.removeEventListener('navigation-updated', onUpdate);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleMouseEnter = (id) => {
    clearTimeout(closeTimer.current);
    setActiveMenu(id);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 150);
  };

  return (
    <>
      <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-inner">
          {/* Logo */}
          <Link to="/" className="site-logo">
            <span className="logo-main">CHÂN ĐI</span>
            <span className="logo-accent"> & </span>
            <span className="logo-main">NẾM</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="desktop-nav" aria-label="Navigation chính">
            {navItems.map((item) => {
              const hasChildren = item.children?.filter(c => c.isActive).length > 0;
              return (
                <div
                  key={item.id}
                  className="nav-item-wrap"
                  onMouseEnter={() => hasChildren && handleMouseEnter(item.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) => `nav-item ${isActive ? 'nav-item--active' : ''} ${hasChildren ? 'nav-item--has-children' : ''}`}
                  >
                    {item.icon && <DynIcon name={item.icon} size={14} className="nav-item-icon" />}
                    {item.label}
                    {hasChildren && <ChevronDown size={12} className={`nav-chevron ${activeMenu === item.id ? 'rotated' : ''}`} />}
                    <span className="nav-underline" />
                  </NavLink>

                  {/* Mega Menu Dropdown */}
                  {hasChildren && activeMenu === item.id && (
                    <div
                      className="mega-menu-wrap"
                      onMouseEnter={() => handleMouseEnter(item.id)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {item.children.some(c => c.children?.length > 0 || c.imageUrl) ? (
                        <MegaMenu children={item.children} parentPath={item.path} />
                      ) : (
                        <FlyoutMenu items={item.children.filter(c => c.isActive)} />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="header-right">
            <button className="header-icon-btn" onClick={() => setIsSearchOpen(true)} aria-label="Tìm kiếm">
              <Search size={19} strokeWidth={1.75} />
            </button>
            <Link to="/saved" className="header-icon-btn" aria-label="Đã lưu">
              <Bookmark size={19} strokeWidth={1.75} />
            </Link>
            <div className="header-divider" />
            <Link to="/login" className="header-login-btn">Đăng Nhập</Link>
            <button className="mobile-menu-btn" onClick={() => setIsMobileOpen(!isMobileOpen)}>
              {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <div className={`mobile-nav ${isMobileOpen ? 'open' : ''}`}>
          <div className="mobile-nav-links">
            {navItems.map(item => (
              <MobileAccordionItem
                key={item.id}
                item={item}
                onClose={() => setIsMobileOpen(false)}
              />
            ))}
            <Link to="/login" className="mobile-login-btn" onClick={() => setIsMobileOpen(false)}>
              Đăng Nhập
            </Link>
          </div>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;
