import React, { useState } from 'react';
import '../styles/Modals.css';

function ReportModal({ article, isOpen, onClose, onToast }) {
  const [selectedReason, setSelectedReason] = useState('fake_news');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !article) return null;

  const reasons = [
    { id: 'fake_news', label: '🚨 Fake or Misleading News', desc: 'Contains fabricated facts or unverified rumors.' },
    { id: 'spam', label: '⚠️ Spam or Sensationalist Headline', desc: 'Clickbait title or deceptive advertisement link.' },
    { id: 'hate_speech', label: '🚫 Hate Speech or Harassment', desc: 'Promotes violence, discrimination, or abusive language.' },
    { id: 'copyright', label: '🔏 Copyright / IP Violation', desc: 'Uses copyrighted images or text without attribution.' },
    { id: 'other', label: '❓ Other Content / Technical Issue', desc: 'Formatting bug, broken image, or other concern.' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    setTimeout(() => {
      setSubmitting(false);
      if (onToast) {
        onToast('Report submitted successfully! Our moderation team will review this article within 24 hours. 🙏', 'success');
      }
      onClose();
    }, 600);
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title" style={{ color: 'var(--accent-red)' }}>🚩 Report News Article</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="report-target-info">
            <span>Reporting Article:</span>
            <strong>{article.title}</strong>
          </div>

          <p className="report-help-text">
            Why are you reporting this story? Your report is confidential and helps Pravah News maintain high journalistic standards.
          </p>

          <div className="report-reasons-list">
            {reasons.map((r) => (
              <label 
                key={r.id} 
                className={`report-reason-item ${selectedReason === r.id ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="reportReason"
                  value={r.id}
                  checked={selectedReason === r.id}
                  onChange={() => setSelectedReason(r.id)}
                />
                <div className="reason-text">
                  <span className="reason-label">{r.label}</span>
                  <span className="reason-desc">{r.desc}</span>
                </div>
              </label>
            ))}
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label htmlFor="details">Additional Comments (Optional)</label>
            <textarea
              id="details"
              rows="3"
              placeholder="Provide any specific links or details to help our reviewers..."
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              className="modal-textarea"
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-danger" disabled={submitting} style={{ backgroundColor: 'var(--accent-red)', color: '#fff' }}>
              {submitting ? 'Submitting...' : '🚩 Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportModal;
