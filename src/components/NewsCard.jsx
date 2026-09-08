import React from 'react';
import '../styles/NewsCard.css';

function NewsCard({ article, featured = false, layout = 'default', onOpenShare, onOpenReport, onToast }) {
  if (!article) return null;

  const {
    title,
    description,
    post_image,
    category,
    created_at,
    user,
    slug,
    views = '12K',
  } = article;

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    try {
      const options = { month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (e) {
      return 'Recent';
    }
  };

  const getReadingTime = (text = '') => {
    const words = text.split(' ').length;
    const time = Math.ceil(words / 40);
    return `${Math.max(1, time)} min read`;
  };

  const categoryName = category?.name || 'News';
  const categoryColor = category?.color || 'var(--primary, #4f46e5)';

  // Hide system/admin names — show "News Desk" instead
  const rawAuthor = user?.full_name || user?.first_name || '';
  const HIDDEN_NAMES = ['super admin', 'admin', 'administrator', 'root', 'superadmin'];
  const isHiddenName = HIDDEN_NAMES.some(n => rawAuthor.toLowerCase().includes(n));
  const authorName = (!rawAuthor || isHiddenName) ? '' : rawAuthor;

  const authorImg = (!isHiddenName && user?.profile_image) ? user.profile_image : '';
  const imageUrl = post_image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop';

  const WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL || window.location.origin;
  const shareUrl = article.optional_url || `${WEBSITE_URL}/news/${slug || article.id}`;

  const handleClick = () => {
    if (article.isAd) {
      let url = article.link;
      if (!url || url === '#' || url.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
        url = 'https://panditjiapp.com/';
      }
      window.open(url, '_blank', 'noopener,noreferrer');
      if (onToast) onToast(`Visiting sponsor: ${article.user?.full_name || 'Brand Partner'}...`, 'info');
      return;
    }
    // Open in modal using custom event
    const event = new CustomEvent('openArticle', { detail: article });
    window.dispatchEvent(event);
  };

  const handleWhatsAppShare = (e) => {
    e.stopPropagation();
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' - ' + shareUrl)}`;
    window.open(waUrl, '_blank');
    if (onToast) onToast('Opening WhatsApp to share story...', 'success');
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    if (onOpenShare) {
      onOpenShare(article);
    } else if (navigator.share) {
      navigator.share({ title, url: shareUrl }).catch(() => { });
    }
  };

  const handleReportClick = (e) => {
    e.stopPropagation();
    if (onOpenReport) {
      onOpenReport(article);
    } else if (onToast) {
      onToast('Report flagged for moderation review. 🙏', 'info');
    }
  };

  return (
    <article
      className={`news-card ${featured ? 'news-card-featured' : ''} ${layout === 'compact' ? 'news-card-compact' : ''} animate-fade-in`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <div className="news-card-img-wrapper">
        <img
          loading="lazy"
          decoding="async"
          src={imageUrl}
          alt={title}
          className="news-card-img"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop';
          }}
        />
        <span
          className="badge news-card-badge"
          style={{ backgroundColor: categoryColor, color: '#fff' }}
        >
          {categoryName}
        </span>
        <span className="card-views-tag">👁️ {views}</span>
      </div>

      <div className="news-card-content">
        <div className="news-card-meta-top">
          <span className="news-card-date">
            🗓️ {formatDate(created_at)}
          </span>
          <span className="news-card-read-time">
            ⏱️ {getReadingTime(description || title)}
          </span>
        </div>

        <h3 className="news-card-title">{title}</h3>

        {description && (
          <p className="news-card-desc">
            {description.replace(/<[^>]*>?/gm, '')}
          </p>
        )}

        {/* Author Footer */}
        <div className="news-card-footer">
          {authorName && (
            <div className="news-card-author">
              {authorImg ? (
                <img
                  src={authorImg}
                  alt={authorName}
                  className="author-avatar"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <span className="author-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-elevated,#f1f5f9)', fontSize: '0.9rem', flexShrink: 0 }}>👤</span>
              )}
              <span className="author-name">{authorName}</span>
            </div>
          )}
          <span className="read-more-link">
            Read Story ›
          </span>
        </div>

        {/* Dailyhunt Ergonomics: Action Bar (WhatsApp, Share, Report) */}
        <div className="dailyhunt-action-bar" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="dh-action-btn dh-whatsapp-btn"
            onClick={handleWhatsAppShare}
            title="Share on WhatsApp"
          >
            <span className="dh-icon">💬</span>
            <span className="dh-text">WhatsApp</span>
          </button>

          <button
            type="button"
            className="dh-action-btn dh-share-btn"
            onClick={handleShareClick}
            title="Share Story"
          >
            <span className="dh-icon">↗️</span>
            <span className="dh-text">Share</span>
          </button>

          <button
            type="button"
            className="dh-action-btn dh-report-btn"
            onClick={handleReportClick}
            title="Report Story"
          >
            <span className="dh-icon">🚩</span>
            <span className="dh-text">Report</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default NewsCard;
