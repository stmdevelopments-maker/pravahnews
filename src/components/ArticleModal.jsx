import React, { useEffect, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import '../styles/Modals.css';

function ArticleModal({ isOpen, article, onClose, onToast }) {
  const { language, t, translateFullArticle } = useTranslation();
  const [displayArticle, setDisplayArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    let isMounted = true;
    const processArticle = async () => {
      if (isOpen && article) {
        if (language === 'hi') {
          setDisplayArticle(article);
        } else {
          setIsLoading(true);
          try {
            const translated = await translateFullArticle(article, language);
            if (isMounted) setDisplayArticle(translated);
          } catch (err) {
            console.error(err);
            if (isMounted) setDisplayArticle(article); // fallback
          } finally {
            if (isMounted) setIsLoading(false);
          }
        }
      } else {
        setDisplayArticle(null);
      }
    };
    processArticle();
    return () => { isMounted = false; };
  }, [isOpen, article, language, translateFullArticle]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      onClose();
    }
  };

  if (isLoading || !displayArticle) {
    return (
      <div className="modal-backdrop animate-fade-in" onClick={handleBackdropClick}>
        <div className="modal-content article-modal-content" style={{ maxWidth: '800px', width: '95%', padding: '3rem', textAlign: 'center' }}>
          <div className="live-dot-pulse" style={{ width: '40px', height: '40px', margin: '0 auto 1rem auto' }}></div>
          <h2>{t('translating')}</h2>
        </div>
      </div>
    );
  }

  const {
    title,
    description,
    post_image,
    created_at,
    user,
    category
  } = displayArticle;

  const categoryName = category?.name || 'News';
  const categoryColor = category?.color || 'var(--primary, #4f46e5)';
  // Hide admin/system names
  const HIDDEN = ['super admin', 'admin', 'administrator', 'root', 'superadmin'];
  const rawAuthor = user?.full_name || user?.first_name || '';
  const isAdminName = HIDDEN.some(n => rawAuthor.toLowerCase().includes(n));
  const authorName = (!rawAuthor || isAdminName) ? '' : rawAuthor;
  const authorImg = (!isAdminName && user?.profile_image) ? user.profile_image : null;
  const imageUrl = post_image || displayArticle.original_url || displayArticle.preview_url || null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString(language === 'en' ? 'en-US' : 'hi-IN', options);
    } catch (e) {
      return 'Recent';
    }
  };

  const formatDescription = (text) => {
    if (!text) return '';
    // If it already contains HTML tags like <p>, <br>, or <div>, return as is
    if (/<[a-z][\s\S]*>/i.test(text)) {
      return text;
    }

    // Split by newlines if natural newlines exist
    if (text.includes('\n')) {
      return text.split('\n')
        .filter(p => p.trim())
        .map(p => `<p style="margin-bottom: 1.25rem;">${p.trim()}</p>`)
        .join('');
    }

    // Otherwise, split by Hindi full stop '।' or English period '.'
    const sentences = text.match(/[^।.]+[।.]+/g);

    // If we can't split or it's very short, just wrap in one paragraph
    if (!sentences || sentences.length <= 2) {
      return `<p style="margin-bottom: 1.25rem;">${text}</p>`;
    }

    let formatted = '';
    let currentParagraph = '';

    for (let i = 0; i < sentences.length; i++) {
      currentParagraph += sentences[i] + ' ';
      // Group every 2 sentences into a paragraph
      if ((i + 1) % 2 === 0 || i === sentences.length - 1) {
        formatted += `<p style="margin-bottom: 1.25rem;">${currentParagraph.trim()}</p>`;
        currentParagraph = '';
      }
    }

    return formatted;
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={handleBackdropClick}>
      <div className="modal-content article-modal-content" style={{ maxWidth: '800px', width: '95%', padding: '0', overflow: 'hidden' }}>

        {/* Modal Header */}
        <div className="modal-header" style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="badge" style={{ backgroundColor: 'var(--accent-red)', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800 }}>
            {categoryName}
          </span>
          <button className="modal-close-btn" onClick={onClose} style={{ fontSize: '1.5rem', color: 'var(--text-main)', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>

        {/* Modal Body */}
        <div className="modal-body article-modal-scroll-area" style={{ maxHeight: '75vh', overflowY: 'auto' }}>

          {imageUrl ? (
            <img
              loading="lazy"
              decoding="async"
              src={imageUrl}
              alt={title || 'Image'}
              style={{ display: 'block', width: '100%', height: 'auto', maxHeight: '450px', objectFit: 'contain', backgroundColor: 'var(--bg-elevated, #f1f5f9)' }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop';
              }}
            />
          ) : (
            <div style={{ width: '100%', height: '200px', background: 'var(--bg-elevated,#f1f5f9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>📰</div>
          )}

          <div style={{ padding: '2.5rem 2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.25rem', fontWeight: 800, marginBottom: '1.25rem', lineHeight: 1.2, color: 'var(--text-main)' }}>{title}</h2>

            <div className="article-meta" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.02em', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
              {authorName && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {authorImg && (
                      <img loading="lazy" decoding="async" src={authorImg} alt={authorName} style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
                    )}
                    <strong>{authorName}</strong>
                  </div>
                  <span>•</span>
                </>
              )}
              <span>{formatDate(created_at)}</span>
            </div>

            <div className="article-full-text" style={{ fontFamily: 'var(--font-sans)', fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--text-main)' }}>
              {/* If HTML is returned, we can render it. For safety, just text or simple dangerouslySetInnerHTML */}
              <div dangerouslySetInnerHTML={{ __html: formatDescription(description || title) }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleModal;
