import React, { useState, useEffect } from 'react';
import '../styles/AdCard.css';

function NativeAdCard({ ad, ads, onToast }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (ads && ads.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % ads.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [ads]);

  const currentAd = (ads && ads.length > 0) ? ads[currentIndex] : ad;

  if (!currentAd) return null;

  const handleAdClick = (e) => {
    e.stopPropagation();
    const link = currentAd.ctaLink || currentAd.link;
    if (link && link !== '#') {
      window.open(link, '_blank');
    }
    if (onToast) {
      onToast(`Visiting sponsor: ${currentAd.advertiser || 'Brand Partner'}...`, 'info');
    }
  };

  let bannerUrl = currentAd.bannerUrl || currentAd.image || currentAd.ad_banner;
  if (bannerUrl && bannerUrl.startsWith('/')) {
    bannerUrl = 'https://pravahnews.com' + bannerUrl;
  }

  return (
    <div 
      className="native-highlight-box glass-panel" 
      onClick={handleAdClick} 
      role="button" 
      tabIndex={0}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '400px',
        borderRadius: 'var(--radius-xl, 24px)',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-md)',
        transition: 'box-shadow var(--transition-normal)',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
    >
      {/* Sponsored Badge overlay */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        backgroundColor: '#ffffff',
        color: 'var(--accent-red, #dc2626)',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '800',
        letterSpacing: '0.5px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        zIndex: 10
      }}>
        SPONSORED
      </div>
      
      {bannerUrl && (
        <img loading="lazy" decoding="async" 
          src={bannerUrl} 
          alt="Sponsored Advertisement" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            position: 'absolute',
            top: 0,
            left: 0
          }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop';
          }} 
        />
      )}
    </div>
  );
}

export default NativeAdCard;
