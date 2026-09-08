import React from 'react';
import NewsCard from '../NewsCard';
import '../../styles/Sections.css';

function PopularSection({ popular, mostRead, onOpenShare, onOpenReport, onToast }) {
  const hasPopular = popular && popular.length > 0;
  const hasMostRead = mostRead && mostRead.length > 0;

  if (!hasPopular && !hasMostRead) return null;

  return (
    <>
      {hasPopular && (
        <section className="section-wrapper animate-fade-in">
          <div className="section-header">
            <div className="section-title-box">
              <span className="section-icon">⭐</span>
              <h2 className="section-title">Popular News</h2>
            </div>
            <span className="badge" style={{ backgroundColor: '#0d9488', color: '#fff' }}>
              Most Liked
            </span>
          </div>
          
          <div className="news-grid-4">
            {popular.slice(0, 8).map((art) => (
              <NewsCard 
                key={art.id} 
                article={art} 
                featured={false}
                onOpenShare={onOpenShare}
                onOpenReport={onOpenReport}
                onToast={onToast}
              />
            ))}
          </div>
        </section>
      )}

      {hasMostRead && (
        <section className="section-wrapper animate-fade-in" style={{ marginTop: '2rem' }}>
          <div className="section-header">
            <div className="section-title-box">
              <span className="section-icon">📈</span>
              <h2 className="section-title">Most Read News</h2>
            </div>
            <span className="badge" style={{ backgroundColor: '#ec4899', color: '#fff' }}>
              Top Viewed
            </span>
          </div>

          <div className="news-grid-4">
            {mostRead.slice(0, 8).map((art) => (
              <NewsCard 
                key={art.id} 
                article={art} 
                featured={false}
                onOpenShare={onOpenShare}
                onOpenReport={onOpenReport}
                onToast={onToast}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default React.memo(PopularSection);
