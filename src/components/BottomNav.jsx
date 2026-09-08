import React from 'react';
import '../styles/BottomNav.css';

function BottomNav({ activeCategory, onSelectCategory, onOpenAddChannel }) {
  const navItems = [
    { id: 'all', label: 'Feed', icon: '🏠', isCategory: true },
    { id: 'livetv', label: 'Live TV', icon: '📺', isCategory: true, isLive: true },
    { id: 'add_channel', label: 'Add TV', icon: '➕', isAction: true, special: true },
    { id: 'sports', label: 'Cricket', icon: '🏏', isCategory: true },
    { id: 'politics', label: 'Politics', icon: '🏛️', isCategory: true },
  ];

  const handleClick = (item) => {
    if (item.isAction && item.id === 'add_channel') {
      if (onOpenAddChannel) onOpenAddChannel();
    } else if (item.isCategory && onSelectCategory) {
      onSelectCategory(item.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="mobile-bottom-nav glass-panel">
      <div className="bottom-nav-grid">
        {navItems.map((item) => {
          const isActive = item.isCategory && activeCategory === item.id;
          return (
            <button
              key={item.id}
              className={`bottom-nav-item ${isActive ? 'active' : ''} ${item.special ? 'special-btn' : ''}`}
              onClick={() => handleClick(item)}
              type="button"
            >
              <div className="bottom-icon-wrapper">
                <span className="bottom-nav-icon">{item.icon}</span>
                {item.isLive && <span className="bottom-live-badge" />}
              </div>
              <span className="bottom-nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
