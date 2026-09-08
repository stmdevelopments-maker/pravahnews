import React from 'react';
import NewsCard from '../NewsCard';
import '../../styles/Sections.css';

function BreakingSection({ breaking, onOpenShare, onOpenReport, onToast }) {
  if (!breaking || breaking.length === 0) return null;

  const latestBreaking = breaking[0];

  return (
    <section className="section-wrapper animate-fade-in">
      {/* Pulsing Red Breaking Ticker Banner */}
      <div className="breaking-ticker-box">
        <span className="breaking-label">
          <span className="live-dot-pulse" style={{ backgroundColor: 'var(--accent-red)' }} />
          BREAKING
        </span>
        <div className="breaking-scroll-text">
          {latestBreaking.title} — {latestBreaking.description || 'Stay tuned to Pravah News for live updates!'}
        </div>
      </div>

      <div className="section-header">
        <div className="section-title-box">
          <span className="section-icon">⚡</span>
          <h2 className="section-title" style={{ color: 'var(--accent-red)' }}>Breaking News</h2>
        </div>
        <span className="badge" style={{ backgroundColor: 'rgba(225, 29, 72, 0.15)', color: 'var(--accent-red)' }}>Live Alerts</span>
      </div>

      <div className="breaking-grid">
        {breaking.slice(0, 3).map((art) => (
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

export default React.memo(BreakingSection);
