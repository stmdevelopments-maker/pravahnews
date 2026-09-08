import React, { useState, useEffect } from 'react';
import '../styles/AdCard.css';

function AdCard({ ad, ads, onToast }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (ads && ads.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % ads.length);
      }, 5000); // Change ad every 5 seconds
      return () => clearInterval(timer);
    }
  }, [ads]);

  const currentAd = (ads && ads.length > 0) ? ads[currentIndex] : ad;

  if (!currentAd) return null;

  const handleAdClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let link = currentAd.ctaLink || currentAd.link || currentAd.ad_url;

    if (link && link !== '#') {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
    if (onToast) {
      onToast(`Visiting sponsor: ${currentAd.advertiser || 'Brand Partner'}...`, 'info');
    }
  };

  let bannerUrl = currentAd.bannerUrl || currentAd.image || currentAd.ad_banner;
  if (bannerUrl && bannerUrl.startsWith('/')) {
    bannerUrl = 'https://pravahnews.com' + bannerUrl;
  }

  const headline = currentAd.headline || currentAd.title || currentAd.ad_title || 'Sponsored Advertisement';
  const description = currentAd.description || currentAd.ad_description || '';
  const ctaText = currentAd.ctaText || 'Learn More';

  return (
    <div className="showcase-wrapper animate-fade-in">
      <style>{`
        .showcase-wrapper { margin: 1rem auto; width: 100%; max-width: 700px; }
        .showcase-container { background: linear-gradient(135deg, var(--bg-card, #fff) 0%, rgba(255, 241, 242, 0.8) 100%); border: 2px solid var(--accent-red, #e11d48); border-radius: var(--radius-lg, 16px); overflow: hidden; box-shadow: 0 10px 25px -5px rgba(225, 29, 72, 0.15); transition: all 0.3s; cursor: pointer; position: relative; }
        .showcase-container:hover { transform: translateY(-3px); box-shadow: 0 15px 30px -5px rgba(225, 29, 72, 0.25); }
        .showcase-top-bar { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 1.25rem; background-color: var(--accent-red, #e11d48); color: #ffffff; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
        .showcase-brand-name { background-color: rgba(255, 255, 255, 0.2); padding: 0.2rem 0.6rem; border-radius: 4px; }
        .showcase-main-body { display: flex; flex-direction: column; padding: 0.75rem; gap: 0.75rem; }
        @media (min-width: 640px) { .showcase-main-body { flex-direction: row; align-items: center; } .showcase-visual-box { width: 180px; height: 100px; flex-shrink: 0; } }
        .showcase-visual-box { width: 100%; height: 120px; border-radius: var(--radius-sm, 6px); background-color: var(--bg-elevated, #f1f5f9); overflow: hidden; border: 1px solid var(--border-color, #e2e8f0); }
        .showcase-visual-asset { width: 100%; height: 100%; object-fit: contain; transition: transform 0.5s; }
        .showcase-container:hover .showcase-visual-asset { transform: scale(1.08); }
        .showcase-info-box { display: flex; flex-direction: column; justify-content: center; gap: 0.25rem; padding: 0; flex: 1; min-width: 0; overflow: hidden; height: 120px; }
        @media (min-width: 640px) { .showcase-info-box { padding: 0 0.75rem; height: 100px; } }
        .showcase-title-text { font-size: 1rem; font-weight: 900; color: var(--text-main, #0f172a); margin: 0; line-height: 1.3; }
        .showcase-subtitle-text { font-size: 0.85rem; color: var(--text-muted, #64748b); margin: 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .showcase-action-row { display: flex; align-items: center; justify-content: space-between; margin-top: 0.25rem; flex-wrap: wrap; gap: 0.5rem; }
        .showcase-action-btn { padding: 0.4rem 1rem; border-radius: 30px; background-color: var(--accent-red, #e11d48); color: #ffffff; font-weight: 800; font-size: 0.85rem; border: none; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(225, 29, 72, 0.3); }
        .showcase-action-btn:hover { background-color: #be123c; transform: scale(1.05); }
        .showcase-bottom-note { font-size: 0.7rem; color: var(--text-muted, #64748b); font-style: italic; }
      `}</style>
      <div className="showcase-container glass-panel" onClick={handleAdClick} role="button" tabIndex={0}>
        <div className="showcase-top-bar">
          <span className="showcase-brand-name">
            {currentAd.type === 'party' ? '📢 Political Campaign Ad' : '✨ Brand Partner Ad'}
          </span>
          <span className="showcase-brand-name">{currentAd.advertiser || 'Sponsored'}</span>
        </div>

        <div className="showcase-main-body">
          {bannerUrl && (
            <div className="showcase-visual-box">
              <img loading="lazy" decoding="async"
                src={bannerUrl}
                alt={headline}
                className="showcase-visual-asset"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop';
                }}
              />
            </div>
          )}

          <div className="showcase-info-box">
            <h4 className="showcase-title-text">{headline}</h4>
            {description && <p className="showcase-subtitle-text">{description}</p>}

            <div className="showcase-action-row">
              <button type="button" className="showcase-action-btn" onClick={handleAdClick}>
                {ctaText} <span>↗</span>
              </button>
              <span className="showcase-bottom-note">Sponsored content displayed via Dailyhunt Ad Engine</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdCard;
