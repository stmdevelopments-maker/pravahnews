import React from 'react';
import '../../styles/Sections.css';

function TrendingSection({ trending, onOpenShare, onOpenReport, onToast }) {
  if (!trending || trending.length === 0) return null;

  const handleClick = (art) => {
    const event = new CustomEvent('openArticle', { detail: art });
    window.dispatchEvent(event);
  };

  return (
    <section className="section-wrapper animate-fade-in">
      <div className="editorial-section-header">
        <h2 className="editorial-section-title">Trending</h2>
        <div className="editorial-header-line"></div>
      </div>

      <div className="editorial-trending-grid">
        {trending.slice(0, 5).map((art, index) => (
          <article 
            key={art.id} 
            className="editorial-trending-item"
            onClick={() => handleClick(art)}
            role="button"
            tabIndex={0}
          >
            <div className="trending-rank">{index + 1}</div>
            <div className="trending-content">
              <h4 className="trending-headline">{art.title}</h4>
              <div className="trending-meta">
                <span className="trending-category">{art.category?.name || 'Trending'}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default React.memo(TrendingSection);
