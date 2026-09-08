import React from 'react';
import NewsCard from '../NewsCard';
import '../../styles/Sections.css';

function HeroSection({ slider, onOpenShare, onOpenReport, onToast }) {
  if (!slider || slider.length === 0) return null;

  const mainStory = slider[0];
  const sideStories = slider.slice(1, 3);

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Recent';
    }
  };

  const handleMainClick = () => {
    const event = new CustomEvent('openArticle', { detail: mainStory });
    window.dispatchEvent(event);
  };

  // Extract author safely
  const HIDDEN = ['super admin', 'admin', 'administrator', 'root', 'superadmin'];
  const rawName = mainStory.user?.full_name || '';
  const isAdmin = HIDDEN.some(n => rawName.toLowerCase().includes(n));
  const authorName = (!rawName || isAdmin) ? 'Editorial Desk' : rawName;

  return (
    <section className="section-wrapper animate-fade-in editorial-hero-wrapper">
      <div className="editorial-hero-grid">
        {/* Main Hero Story */}
        <article className="hero-main-article" onClick={handleMainClick} role="button" tabIndex={0}>
          <div className="hero-main-image-container">
            <img 
              src={mainStory.post_image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop'} 
              alt={mainStory.title} 
              className="hero-main-image"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop'; }}
            />
            {/* Elegant gradient overlay just for text readability at bottom */}
            <div className="hero-image-overlay" />
            
            <div className="hero-category-label">
              {mainStory.category?.name || 'Top Story'}
            </div>
          </div>
          
          <div className="hero-main-text">
            <h1 className="hero-title">{mainStory.title}</h1>
            <p className="hero-excerpt">
              {mainStory.description?.replace(/<[^>]*>?/gm, '') || 'Read the full story to learn more...'}
            </p>
            <div className="hero-meta">
              <span className="hero-author">By <strong>{authorName}</strong></span>
              <span className="hero-meta-divider">•</span>
              <span className="hero-time">{formatDate(mainStory.created_at)}</span>
            </div>
          </div>
        </article>

        {/* Side Stories */}
        <aside className="hero-side-articles">
          {sideStories.map((art) => (
            <NewsCard 
              key={art.id} 
              article={art} 
              featured={false}
              layout="compact"
              onOpenShare={onOpenShare}
              onOpenReport={onOpenReport}
              onToast={onToast}
            />
          ))}
        </aside>
      </div>
    </section>
  );
}

export default React.memo(HeroSection);
