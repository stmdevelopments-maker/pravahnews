import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import '../styles/Header.css';

function Header({
  darkMode, onToggleTheme, onSearch,
  authUser, onOpenAuth, onLogout,
  activeCategory, onSelectCategory
}) {
  const { language, setLanguage, t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const drawerRef = useRef(null);
  const loggedIn = !!authUser;



  useEffect(() => {
    const handler = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) setDrawerOpen(false);
    };
    if (drawerOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [drawerOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
    setSearchOpen(false);
  };

  const navCategories = [
    { id: 'all', label: 'Home', hiLabel: 'मुख्य पृष्ठ' },
    { id: 'breaking', label: 'Breaking', hiLabel: 'प्रमुख-समाचार' },
    { id: 'national', label: 'National', hiLabel: 'राष्ट्रीय' },
    { id: 'world', label: 'World', hiLabel: 'अंतरराष्ट्रीय' },
    { id: 'politics', label: 'Politics', hiLabel: 'राजनीति' },
    { id: 'business', label: 'Business', hiLabel: 'व्यापार' },
    { id: 'technology', label: 'Technology', hiLabel: 'तकनीक' },
    { id: 'sports', label: 'Sports', hiLabel: 'खेल' },
    { id: 'entertainment', label: 'Entertainment', hiLabel: 'मनोरंजन' },
    { id: 'lifestyle', label: 'Lifestyle', hiLabel: 'जीवनशैली' }
  ];

  return (
    <>
      <header className="site-header">
        <div className="header-main">
          {/* 1. Logo & Hamburger on Left */}
          <div className="header-left">
            <button
              className="hamburger-btn"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <a href={import.meta.env.BASE_URL} className="header-logo-link" onClick={(e) => {
              e.preventDefault();
              // If already on home, just scroll to top
              const currentHash = window.location.hash || '';
              const currentRoute = currentHash.startsWith('#') ? currentHash.slice(1) : '/';

              if (currentRoute === '/' || currentRoute === '') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                if (onSelectCategory) onSelectCategory('all');
                if (onSearch) onSearch('');
              } else {
                window.location.hash = '#/';
              }
            }}>
              <img
                src="https://pravahnews.com/public/uploads/logo/1352/WhatsApp-Image-2025-12-18-at-4.38.02-PM-removebg-preview.png"
                alt="Pravah News"
                className="header-logo-img"
              />
            </a>
          </div>

          {/* 2. Search Bar in Center */}
          <div className="header-center">
            <form onSubmit={handleSearchSubmit} className="inline-search-form">
              <div className="search-input-wrapper">
                <svg className="search-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  className="inline-search-input"
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button type="submit" className="inline-search-btn">{t('search')}</button>
            </form>
          </div>

          {/* 3. Actions on Right */}
          <div className="header-right-actions">

            <div className="header-lang-wrapper hidden-mobile">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '4px', color: 'var(--text-muted)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <select
                className="lang-select-dropdown"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="hi">हिंदी</option>
                <option value="en">English</option>
              </select>
            </div>



            <button className="theme-toggle" onClick={onToggleTheme}>
              {darkMode ? '☀️ लाइट' : '🌙 डार्क'}
            </button>

            {loggedIn ? (
              <div className="user-profile-badge">
                <div className="user-avatar">
                  {authUser?.name?.charAt(0) || 'U'}
                </div>
                <span className="user-name hidden-mobile">{authUser?.name?.split(' ')[0] || 'User'}</span>
                <div className="user-dropdown">
                  <button onClick={() => window.location.href = import.meta.env.BASE_URL + 'profile'}>Profile</button>
                  <button onClick={onLogout} className="logout-btn">{t('logout')}</button>
                </div>
              </div>
            ) : (
              <button className="header-login-btn" onClick={onOpenAuth}>
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 4. Mobile Drawer Menu */}
      {drawerOpen && (
        <>
          <div className="mobile-drawer-overlay" onClick={() => setDrawerOpen(false)} />
          <div className="mobile-drawer-content dark-drawer" ref={drawerRef}>
            <div className="drawer-header dark-drawer-header">
              <div className="drawer-title">
                <span className="drawer-title-icon">⚖️</span> LEGAL & HELP CENTER
              </div>
              <button className="drawer-close dark-close" onClick={() => setDrawerOpen(false)}>✕</button>
            </div>
            <div className="drawer-body dark-drawer-body">
              <a href="#/privacy-policy" className="drawer-nav-item" onClick={() => setDrawerOpen(false)}>
                <span className="drawer-item-icon">🔒</span> Privacy Policy <span className="chevron">›</span>
              </a>
              <a href="#/rules" className="drawer-nav-item" onClick={() => setDrawerOpen(false)}>
                <span className="drawer-item-icon">📜</span> Rules and Regulation <span className="chevron">›</span>
              </a>
              <a href="#/refund-policy" className="drawer-nav-item" onClick={() => setDrawerOpen(false)}>
                <span className="drawer-item-icon">💸</span> Refund Policy <span className="chevron">›</span>
              </a>
              <a href="#/cancellation" className="drawer-nav-item" onClick={() => setDrawerOpen(false)}>
                <span className="drawer-item-icon">❌</span> Cancellation Subscription <span className="chevron">›</span>
              </a>
              <a href="#/faq" className="drawer-nav-item" onClick={() => setDrawerOpen(false)}>
                <span className="drawer-item-icon">❓</span> FAQ <span className="chevron">›</span>
              </a>
              <a href="#/notifications" className="drawer-nav-item" onClick={() => setDrawerOpen(false)}>
                <span className="drawer-item-icon">🔔</span> Notifications <span className="chevron">›</span>
              </a>
              <a href="#/support" className="drawer-nav-item" onClick={() => setDrawerOpen(false)}>
                <span className="drawer-item-icon">💬</span> Help & Support <span className="chevron">›</span>
              </a>

              {/* Language Selector for Mobile */}
              <div className="drawer-nav-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="drawer-item-icon">🌐</span> Language
                </div>
                <select
                  className="lang-select-dropdown"
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value);
                    setDrawerOpen(false);
                  }}
                  style={{ background: 'var(--bg-elevated)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '4px 8px' }}
                >
                  <option value="hi">हिंदी</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="drawer-login-wrapper">
                <button className="drawer-login-btn" onClick={() => { setDrawerOpen(false); if (onOpenAuth) onOpenAuth(); }}>
                  <span className="drawer-item-icon">🔑</span> {loggedIn ? 'Profile / Logout' : 'Login / Forgot Password'} <span className="chevron">›</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Header;
