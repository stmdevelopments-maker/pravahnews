import React from 'react';
import '../styles/BreakingTicker.css';

function BreakingTicker({ news = [] }) {
  if (!news || news.length === 0) return null;

  // Duplicate items for seamless loop
  const marqueeItems = [...news, ...news];

  const WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL || '';

  const handleArticleClick = (item) => {
    const event = new CustomEvent('openArticle', { detail: item });
    window.dispatchEvent(event);
  };

  return (
    <div className="breaking-ticker-wrapper">
      <div className="container breaking-ticker-container">
        <div className="ticker-label">
          <span className="badge badge-red badge-live">Live Breaking</span>
        </div>
        
        <div className="ticker-content-area">
          <div className="ticker-track">
            {marqueeItems.map((item, index) => (
              <div 
                key={`${item.id || index}-${index}`} 
                className="ticker-item"
                onClick={() => handleArticleClick(item)}
                role="button"
                tabIndex={0}
              >
                <span className="ticker-bullet">●</span>
                <span className="ticker-title">{item.title}</span>
                {item.category?.name && (
                  <span className="ticker-category">[{item.category.name}]</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BreakingTicker;
