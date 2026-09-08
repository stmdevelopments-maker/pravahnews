import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

function Profile({ authUser, onLogout }) {
  const { t } = useTranslation();

  if (!authUser) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center', minHeight: '60vh' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>{t('accessDenied')}</h2>
        <p style={{ color: 'var(--text-muted)' }}>{t('loginToView')}</p>
        <button 
          onClick={() => window.location.href = '/'} 
          style={{ marginTop: '2rem', padding: '0.75rem 2rem', backgroundColor: 'var(--accent-red)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {t('goToHome')}
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1rem', minHeight: '70vh' }}>
      <div className="editorial-section-header">
        <h2 className="editorial-section-title">{t('myProfile')}</h2>
        <div className="editorial-header-line"></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Profile Card */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', flexShrink: 0 }}>
            {authUser.profile_image ? (
              <img src={authUser.profile_image} alt={authUser.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              '👤'
            )}
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>
              {authUser.name || authUser.full_name || t('newsReader')}
            </h3>
            <p style={{ margin: '0 0 1rem 0', color: 'var(--text-muted)', fontSize: '1rem' }}>
              {authUser.email}
            </p>
            <span className="badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
              {authUser.role === 'admin' || authUser.role === 'superadmin' ? t('editorialTeam') : t('registeredReader')}
            </span>
          </div>
        </div>

        {/* Profile Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>{t('accountSettings')}</h4>
          
          <button style={{ textAlign: 'left', padding: '1rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: 'var(--text-main)' }}>
            🔖 {t('savedArticles')}
          </button>
          
          <button style={{ textAlign: 'left', padding: '1rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: 'var(--text-main)' }}>
            🔔 {t('notificationPrefs')}
          </button>

          <button 
            onClick={() => { onLogout(); window.location.href = '/'; }}
            style={{ textAlign: 'left', padding: '1rem', backgroundColor: '#fef2f2', border: '1px solid #fecdd3', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: '#e11d48', marginTop: '1rem' }}
          >
            🚪 {t('logOutBtn')}
          </button>
        </div>

      </div>
    </div>
  );
}

export default Profile;
