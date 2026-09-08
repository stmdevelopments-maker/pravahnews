import React, { useState } from 'react';
import '../styles/Modals.css';

function ShareModal({ article, isOpen, onClose, onToast }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !article) return null;

  const WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL || window.location.origin;
  const shareUrl = article.optional_url || `${WEBSITE_URL}/news/${article.slug || article.id}`;
  const shareTitle = article.title || 'Check out this breaking story on Pravah News!';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    if (onToast) {
      onToast('Link copied to clipboard! 📋', 'success');
    }
    setTimeout(() => setCopied(false), 3000);
  };

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: '💬',
      color: '#25D366',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' - ' + shareUrl)}`,
    },
    {
      name: 'Twitter / X',
      icon: '🐦',
      color: '#1DA1F2',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'Facebook',
      icon: '📘',
      color: '#1877F2',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'Telegram',
      icon: '✈️',
      color: '#0088cc',
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      color: '#0A66C2',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'Email',
      icon: '📧',
      color: '#ea4335',
      url: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent('I thought you might find this interesting: ' + shareUrl)}`,
    },
  ];

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">↗️ Share Story</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal-body">
          <div className="share-article-preview">
            <img 
              src={article.post_image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=200&auto=format&fit=crop'} 
              alt={article.title} 
              className="share-preview-img"
            />
            <div className="share-preview-text">
              <span className="badge" style={{ backgroundColor: article.category?.color || 'var(--primary)', color: '#fff', fontSize: '0.65rem' }}>
                {article.category?.name || 'News'}
              </span>
              <h4 className="share-preview-title">{article.title}</h4>
            </div>
          </div>

          <div className="share-link-box">
            <input type="text" readOnly value={shareUrl} className="share-url-input" />
            <button className={`btn ${copied ? 'btn-success' : 'btn-primary'} copy-btn`} onClick={handleCopy}>
              {copied ? '✓ Copied' : '📋 Copy Link'}
            </button>
          </div>

          <p className="share-section-label">Or share directly via social apps:</p>
          
          <div className="share-grid">
            {shareLinks.map((plat) => (
              <a
                key={plat.name}
                href={plat.url}
                target="_blank"
                rel="noopener noreferrer"
                className="share-plat-card"
                style={{ '--plat-color': plat.color }}
                onClick={() => {
                  if (onToast) onToast(`Opening ${plat.name}...`, 'info');
                }}
              >
                <span className="plat-icon">{plat.icon}</span>
                <span className="plat-name">{plat.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShareModal;
