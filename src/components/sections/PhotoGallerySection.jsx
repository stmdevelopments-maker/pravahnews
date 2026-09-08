import React from 'react';
import '../../styles/Sections.css';

function PhotoGallerySection({ photos, onToast }) {
  if (!photos || photos.length === 0) return null;

  const handlePhotoClick = (photo) => {
    const event = new CustomEvent('openArticle', { detail: photo });
    window.dispatchEvent(event);
  };

  return (
    <section className="section-wrapper animate-fade-in">
      <div className="section-header">
        <div className="section-title-box">
          <span className="section-icon">📸</span>
          <h2 className="section-title">Photo Gallery</h2>
        </div>
        <span className="badge" style={{ backgroundColor: '#059669', color: '#fff' }}>Visual Stories</span>
      </div>

      <div className="gallery-grid">
        {photos.slice(0, 8).map((photo, index) => {
          const imgUrl = photo.post_image || photo.original_url || photo.preview_url || 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=600&auto=format&fit=crop';
          const title = photo.title || photo.name || `Visual Story #${index + 1}`;
          
          return (
            <div 
              key={photo.id || index} 
              className="gallery-card"
              onClick={() => handlePhotoClick(photo)}
              role="button"
              tabIndex={0}
            >
              <img 
                src={imgUrl} 
                alt={title} 
                className="gallery-img"
                loading="lazy"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=600&auto=format&fit=crop';
                }}
              />
              <div className="gallery-caption">
                <span>📷 {title}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default React.memo(PhotoGallerySection);
