import React, { useState, useEffect, useRef, useCallback } from 'react';
import NewsCard from '../NewsCard';
import AdCard from '../AdCard';
import '../../styles/Sections.css';

const PAGE_SIZE = 8; // kitni news ek baar dikhao

function LatestSection({ latest, ads, onOpenShare, onOpenReport, onOpenArticle, onToast }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore]  = useState(false);
  const [hasShownEndToast, setHasShownEndToast] = useState(false);
  const loaderRef = useRef(null);

  // Reset when new data comes in
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    setHasShownEndToast(false);
  }, [latest]);

  // Intersection Observer - jab loader div dikh jaye toh aur load karo
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && !isLoadingMore) {
      const total = latest?.length || 0;
      if (visibleCount < total) {
        setIsLoadingMore(true);
        // Small delay to feel natural
        setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, total));
          setIsLoadingMore(false);
        }, 600);
      } else if (visibleCount >= total && total > PAGE_SIZE && !hasShownEndToast) {
        if (onToast) onToast("✅ आप सभी ताज़ा खबरें पढ़ चुके हैं!", "success");
        setHasShownEndToast(true);
      }
    }
  }, [isLoadingMore, visibleCount, latest, hasShownEndToast, onToast]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '200px', // 200px pehle hi trigger ho
      threshold: 0.1,
    });
    const el = loaderRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [handleObserver]);

  if (!latest || latest.length === 0) return null;

  const visibleArticles = latest.slice(0, visibleCount);
  const hasMore = visibleCount < latest.length;

  const renderGridWithAds = () => {
    const elements = [];
    visibleArticles.forEach((art, idx) => {
      elements.push(
        <NewsCard
          key={art.id || idx}
          article={art}
          featured={false}
          onOpenShare={onOpenShare}
          onOpenReport={onOpenReport}
          onOpenArticle={onOpenArticle}
          onToast={onToast}
        />
      );

      // Dynamic Ad Injection after every 6th article
      if ((idx + 1) % 6 === 0 && ads && ads.length > 0) {
        elements.push(
          <div key={`ad-inject-${idx}`} style={{ gridColumn: '1 / -1', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <AdCard ads={ads} onToast={onToast} />
          </div>
        );
      }
    });
    return elements;
  };

  return (
    <section className="section-wrapper animate-fade-in">
      <div className="section-header">
        <div className="section-title-box">
          <span className="section-icon">📰</span>
          <h2 className="section-title">Latest News &amp; All Stories</h2>
        </div>
        <span className="badge" style={{ backgroundColor: 'var(--primary, #4f46e5)', color: '#fff' }}>
          {latest.length} Stories
        </span>
      </div>

      <div className="news-grid-4">
        {renderGridWithAds()}
      </div>

      {/* Infinite Scroll Loader */}
      <div ref={loaderRef} className="infinite-scroll-trigger" style={{ height: '20px' }}>
        {isLoadingMore && (
          <div className="infinite-loader">
            <div className="infinite-dots">
              <span /><span /><span />
            </div>
            <p>Loading more stories...</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default React.memo(LatestSection);
