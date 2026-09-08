import React, { useState } from 'react';
import '../styles/Modals.css';

function AddChannelModal({ isOpen, onClose, onAddChannel, onToast }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('National News');
  const [urlInput, setUrlInput] = useState('');
  const [logo, setLogo] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const categories = [
    'National News',
    'World News',
    'Tech & Science',
    'Sports TV',
    'Business & Economy',
    'Entertainment Live',
    'Regional / Local',
  ];

  // Convert standard YouTube link or video ID to embed URL
  const formatEmbedUrl = (input) => {
    if (!input) return '';
    const trimmed = input.trim();
    if (trimmed.includes('youtube.com/embed/')) {
      return trimmed;
    }
    // Check if it's a standard watch link: https://www.youtube.com/watch?v=XXXX
    const watchMatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/);
    if (watchMatch && watchMatch[1]) {
      return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1`;
    }
    // Check if it's just an 11-char ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return `https://www.youtube.com/embed/${trimmed}?autoplay=1`;
    }
    // If it's another URL or stream, return as is
    return trimmed;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a channel name.');
      return;
    }
    if (!urlInput.trim()) {
      setError('Please enter a valid YouTube live URL or Video ID.');
      return;
    }

    const embedUrl = formatEmbedUrl(urlInput);

    const newChannel = {
      name: name.trim(),
      category: category,
      embedUrl: embedUrl,
      fallbackVideo: embedUrl,
      logo: logo.trim() || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=200&auto=format&fit=crop',
      description: description.trim() || `Live 24/7 streaming broadcast of ${name.trim()} on Pravah Live TV.`,
    };

    if (onAddChannel) {
      onAddChannel(newChannel);
    }
    if (onToast) {
      onToast(`📺 "${newChannel.name}" added successfully! Now streaming live.`, 'success');
    }

    // Reset form
    setName('');
    setUrlInput('');
    setLogo('');
    setDescription('');
    setError('');
    onClose();
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">📺 Add Live TV / Video Channel</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <p className="report-help-text">
            Bring your favorite news broadcast or live video stream to Pravah News! Add a YouTube Live link or video ID to stream instantly.
          </p>

          {error && <div className="modal-error-badge">⚠️ {error}</div>}

          <div className="form-group">
            <label htmlFor="chName">Channel / Stream Name *</label>
            <input
              type="text"
              id="chName"
              placeholder="e.g. Republic World Live, BBC News 24x7, TechStream HD"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              className="modal-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="chCat">Broadcast Category *</label>
            <select
              id="chCat"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="modal-select"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="chUrl">YouTube Live URL or Video ID *</label>
            <input
              type="text"
              id="chUrl"
              placeholder="e.g. https://www.youtube.com/watch?v=jfKfPfyJRdk or jfKfPfyJRdk"
              value={urlInput}
              onChange={(e) => { setUrlInput(e.target.value); setError(''); }}
              className="modal-input"
              required
            />
            <span className="field-hint">💡 Tip: You can paste a YouTube live stream link, embed URL, or 11-character video ID.</span>
          </div>

          <div className="form-group">
            <label htmlFor="chLogo">Channel Logo URL (Optional)</label>
            <input
              type="url"
              id="chLogo"
              placeholder="https://images.unsplash.com/photo-1585829365... (Leave empty for default)"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              className="modal-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="chDesc">Channel Description (Optional)</label>
            <textarea
              id="chDesc"
              rows="2"
              placeholder="Brief summary of what this channel broadcasts..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="modal-textarea"
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'var(--primary)', color: '#fff' }}>
              ➕ Add & Watch Live
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddChannelModal;
