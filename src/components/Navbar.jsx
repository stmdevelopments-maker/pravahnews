import React, { useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import '../styles/Navbar.css';

function Navbar({ activeCategory = 'all', onSelectCategory, onOpenAddChannel }) {
  const scrollRef = useRef(null);
  const { t } = useTranslation();

  const categories = [
    { id: 'all', label: t('topNews'), icon: '🔥' },
    { id: 'breaking', label: t('breakingNews'), icon: '🚨' },
    { id: 'national', label: t('national'), icon: '' },
    { id: 'world', label: t('international'), icon: '🌐' },
    { id: 'politics', label: t('politics'), icon: '🏛️' },
    { id: 'business', label: t('business'), icon: '📈' },
    { id: 'technology', label: t('technology'), icon: '💻' },
    { id: 'sports', label: t('sports'), icon: '🏏' },
    { id: 'entertainment', label: t('entertainment'), icon: '🎬' },
    { id: 'lifestyle', label: t('lifestyle'), icon: '✨' },
  ];

  const handleScroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -260 : 260,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="site-navbar">
      <div className="navbar-container">
        {/* Left Scroll Arrow */}
        <button 
          className="nav-scroll-btn"
          onClick={() => handleScroll('left')}
          aria-label="Scroll left"
        >
          ‹
        </button>

        {/* Categories Track (Single horizontal line, no wrap) */}
        <div className="navbar-track" ref={scrollRef}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`nav-item-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => onSelectCategory && onSelectCategory(cat.id)}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}

          <div className="nav-divider" />

          {/* Live TV Button */}
          <button 
            className="nav-action-live"
            onClick={() => onSelectCategory && onSelectCategory('livetv')}
          >
            <span className="live-pulse-dot" />
            <span>{t('liveTv')}</span>
          </button>

          {/* Add Channel Button */}
          <button 
            className="nav-action-add"
            onClick={onOpenAddChannel}
          >
            <span>➕</span>
            <span>{t('addChannel')}</span>
          </button>
        </div>

        {/* Right Scroll Arrow */}
        <button 
          className="nav-scroll-btn"
          onClick={() => handleScroll('right')}
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
