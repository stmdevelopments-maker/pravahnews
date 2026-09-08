import React from 'react';
import NewsCard from '../NewsCard';
import '../../styles/Sections.css';

function FeaturedSection({ featured, onOpenShare, onOpenReport, onToast }) {
  if (!featured || featured.length === 0) return null;

  return (
    <section className="section-wrapper animate-fade-in">
      <div className="section-header">
        <div className="section-title-box">
          <span className="section-icon">✨</span>
          <h2 className="section-title">Featured Stories</h2>
        </div>
        <span className="badge" style={{ backgroundColor: '#9333ea', color: '#fff' }}>Curated Special</span>
      </div>

      <div className="news-grid-3">
        {featured.map((art) => (
          <NewsCard 
            key={art.id} 
            article={art} 
            featured={true}
            onOpenShare={onOpenShare}
            onOpenReport={onOpenReport}
            onToast={onToast}
          />
        ))}
      </div>
    </section>
  );
}

export default React.memo(FeaturedSection);
