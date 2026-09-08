import React from 'react';
import NewsCard from '../NewsCard';
import '../../styles/Sections.css';

function EditorsPickSection({ editorsPick, onOpenShare, onOpenReport, onToast }) {
  if (!editorsPick || editorsPick.length === 0) return null;

  return (
    <section className="section-wrapper animate-fade-in">
      <div className="section-header">
        <div className="section-title-box">
          <span className="section-icon">🎖️</span>
          <h2 className="section-title" style={{ color: '#2563eb' }}>Editors' Picks</h2>
        </div>
        <span className="badge" style={{ backgroundColor: '#2563eb', color: '#fff' }}>Recommended by Desk</span>
      </div>

      <div className="news-grid-4">
        {editorsPick.map((art) => (
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
  );
}

export default React.memo(EditorsPickSection);
