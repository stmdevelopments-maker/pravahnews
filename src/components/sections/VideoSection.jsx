import React, { useState, useEffect } from 'react';
import NewsCard from '../NewsCard';
import '../../styles/Sections.css';

function VideoSection({ videos = [], liveChannels = [], onOpenAddChannel, onOpenShare, onOpenReport, onToast }) {
  const [selectedChannel, setSelectedChannel] = useState(null);

  useEffect(() => {
    if (liveChannels && liveChannels.length > 0 && !selectedChannel) {
      setSelectedChannel(liveChannels[0]);
    }
  }, [liveChannels, selectedChannel]);

  if ((!videos || videos.length === 0) && (!liveChannels || liveChannels.length === 0)) {
    return null;
  }

  const handleChannelSelect = (ch) => {
    setSelectedChannel(ch);
    if (onToast) {
      onToast(`Switched broadcast to: ${ch.name} 📺`, 'info');
    }
  };

  return (
    <section className="section-wrapper animate-fade-in" id="livetv-section">
      <div className="section-header">
        <div className="section-title-box">
          <span className="section-icon">📺</span>
          <h2 className="section-title">Live Video Channel Hub & Broadcasts</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="badge" style={{ backgroundColor: 'var(--accent-red)', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className="live-dot-pulse" style={{ backgroundColor: '#fff' }} />
            24/7 LIVE
          </span>
          <button 
            type="button"
            className="btn btn-primary"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', fontWeight: 800, borderRadius: '20px' }}
            onClick={onOpenAddChannel}
          >
            ➕ Add Live Channel
          </button>
        </div>
      </div>

      {/* Main 24/7 Live Stream Player Box & Channel Switcher */}
      {selectedChannel && (
        <div className="live-hub-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '2.5rem', background: 'var(--bg-elevated)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#000', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}>
              <iframe
                src={selectedChannel.embedUrl || selectedChannel.fallbackVideo}
                title={selectedChannel.name}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge" style={{ backgroundColor: 'var(--accent-red)', color: '#fff' }}>
                    LIVE NOW
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    👁️ {selectedChannel.viewers || '15K'} watching
                  </span>
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, margin: '0.35rem 0 0' }}>{selectedChannel.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0' }}>{selectedChannel.description}</p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => onToast && onToast('Link copied to clipboard! 📋', 'success')}>
                  ↗ Share Stream
                </button>
                <button type="button" className="btn btn-primary" onClick={onOpenAddChannel}>
                  ➕ Add Stream
                </button>
              </div>
            </div>
          </div>

          {/* Channel Switcher Track */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
              📻 Select Broadcast Channel ({liveChannels.length} Streams Available)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
              {liveChannels.map((ch) => {
                const isSelected = selectedChannel?.id === ch.id || selectedChannel?.name === ch.name;
                return (
                  <div
                    key={ch.id || ch.name}
                    onClick={() => handleChannelSelect(ch)}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '12px',
                      backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-card)',
                      color: isSelected ? '#fff' : 'var(--text-main)',
                      border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      transition: 'all 0.2s',
                      boxShadow: isSelected ? '0 10px 15px -3px rgba(79, 70, 229, 0.3)' : 'none',
                    }}
                  >
                    <img
                      src={ch.logo || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=100&auto=format&fit=crop'}
                      alt={ch.name}
                      style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ch.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                        {ch.category || 'Live TV'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Video News Clips Grid */}
      {videos && videos.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🎬 Recent Video Reports & Highlights</span>
          </h3>
          <div className="news-grid-4">
            {videos.slice(0, 4).map((art) => (
              <NewsCard 
                key={art.id} 
                article={art} 
                featured={false}
                onOpenShare={onOpenShare}
                onOpenReport={onOpenReport}
                onToast={onToast}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default React.memo(VideoSection);
