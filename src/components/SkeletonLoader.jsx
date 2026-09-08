import React from 'react';
import '../styles/SkeletonLoader.css';

function SkeletonLoader({ type = 'card', count = 1 }) {
  const renderSkeleton = (index) => {
    if (type === 'hero') {
      return (
        <div key={index} className="skeleton-hero-grid animate-fade-in">
          <div className="skeleton-box skeleton-hero-main"></div>
          <div className="skeleton-hero-sub">
            <div className="skeleton-box skeleton-card-sm"></div>
            <div className="skeleton-box skeleton-card-sm"></div>
          </div>
        </div>
      );
    }

    if (type === 'ticker') {
      return (
        <div key={index} className="skeleton-ticker">
          <div className="skeleton-box skeleton-badge"></div>
          <div className="skeleton-box skeleton-line" style={{ width: '60%' }}></div>
        </div>
      );
    }

    // Default card skeleton
    return (
      <div key={index} className="skeleton-card animate-fade-in">
        <div className="skeleton-box skeleton-img"></div>
        <div className="skeleton-content">
          <div className="skeleton-box skeleton-badge" style={{ width: '80px', marginBottom: '10px' }}></div>
          <div className="skeleton-box skeleton-line" style={{ width: '95%', height: '20px', marginBottom: '8px' }}></div>
          <div className="skeleton-box skeleton-line" style={{ width: '70%', height: '20px', marginBottom: '16px' }}></div>
          <div className="skeleton-box skeleton-line" style={{ width: '40%', height: '14px' }}></div>
        </div>
      </div>
    );
  };

  return (
    <div className={type === 'card' ? 'skeleton-grid' : 'skeleton-wrapper'}>
      {Array.from({ length: count }).map((_, idx) => renderSkeleton(idx))}
    </div>
  );
}

export default SkeletonLoader;
