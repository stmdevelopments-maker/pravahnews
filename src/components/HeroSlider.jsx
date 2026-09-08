import React, { useState, useEffect } from 'react';
import '../styles/HeroSlider.css';

function HeroSlider({ sliderNews = [], onOpenArticle }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-cycle through slider news every 6 seconds
  useEffect(() => {
    if (sliderNews.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % Math.min(sliderNews.length, 5));
    }, 6000);

    return () => clearInterval(interval);
  }, [sliderNews.length, isPaused]);

  if (!sliderNews || sliderNews.length === 0) return null;

  // We take up to 5 items for the carousel/grid
  const items = sliderNews.slice(0, 5);
  const mainArticle = items[activeIndex] || items[0];
  
  // Get next two items for the side stacked grid
  const sideArticle1 = items[(activeIndex + 1) % items.length] || items[1] || items[0];
  const sideArticle2 = items[(activeIndex + 2) % items.length] || items[2] || items[0];

  const WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL || '';

  const handleArticleClick = (item) => {
    if (onOpenArticle) {
      onOpenArticle(item);
    } else if (item?.optional_url) {
      window.open(item.optional_url, '_blank');
    } else if (item?.slug) {
      window.open(`${WEBSITE_URL}/news/${item.slug}`, '_blank');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Today';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return 'Recent';
    }
  };

  return (
    <section 
      className="hero-slider-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container">
        <div className="hero-grid">
          {/* Main Featured Banner */}
          <div 
            className="hero-main-card animate-fade-in"
            onClick={() => handleArticleClick(mainArticle)}
            role="button"
            tabIndex={0}
            key={`main-${mainArticle.id || activeIndex}`}
          >
            <div className="hero-img-bg">
              <img 
                loading="eager"
                decoding="async"
                src={mainArticle.post_image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop'} 
                alt={mainArticle.title}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop';
                }}
              />
              <div className="hero-overlay"></div>
            </div>

            <div className="hero-content">
              <div className="hero-meta">
                <span 
                  className="badge" 
                  style={{ 
                    backgroundColor: mainArticle.category?.color || 'var(--primary)', 
                    color: '#fff' 
                  }}
                >
                  {mainArticle.category?.name || 'Featured'}
                </span>
                <span className="hero-date">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  {formatDate(mainArticle.created_at)}
                </span>
              </div>

              <h2 className="hero-title">{mainArticle.title}</h2>
              
              {mainArticle.description && (
                <p className="hero-desc">
                  {mainArticle.description.replace(/<[^>]*>?/gm, '')}
                </p>
              )}

              <div className="hero-author-row">
                <div className="hero-author">
                  {(() => {
                    const HIDDEN = ['super admin', 'admin', 'administrator', 'root', 'superadmin'];
                    const rawName = mainArticle.user?.full_name || '';
                    const isAdmin = HIDDEN.some(n => rawName.toLowerCase().includes(n));
                    const authorName = (!rawName || isAdmin) ? '' : rawName;
                    const authorImg = (!isAdmin && mainArticle.user?.profile_image) ? mainArticle.user.profile_image : null;
                    if (!authorName) return null;
                    return (
                      <>
                        {authorImg && (
                          <img
                            src={authorImg}
                            alt={authorName}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                        <span>{authorName}</span>
                      </>
                    );
                  })()}
                </div>
                <span className="hero-read-btn">
                  Read Full Story →
                </span>
              </div>
            </div>


          </div>

          {/* Side Stacked Stories */}
          <div className="hero-side-grid">
            {[sideArticle1, sideArticle2].map((art, idx) => {
              if (!art) return null;
              return (
                <div 
                  key={`side-${art.id || idx}-${activeIndex}`} 
                  className="hero-side-card animate-fade-in"
                  onClick={() => handleArticleClick(art)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="side-img-wrapper">
                    <img 
                      src={art.post_image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop'} 
                      alt={art.title}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop';
                      }}
                    />
                  </div>
                  <div className="side-content">
                    <div className="side-meta">
                      <span className="side-category" style={{ color: art.category?.color || 'var(--primary)' }}>
                        {art.category?.name || 'News'}
                      </span>
                      <span className="side-date">{formatDate(art.created_at)}</span>
                    </div>
                    <h3 className="side-title">{art.title}</h3>
                    <div className="side-footer">
                      <span className="side-author">{art.user?.full_name || 'Reporter'}</span>
                      <span className="side-link">→</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default React.memo(HeroSlider);
