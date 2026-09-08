import React, { useState } from 'react';
import { loginUser, registerUser, forgotPassword } from '../services/auth.service';
import { useTranslation } from '../hooks/useTranslation';
import '../styles/AuthModal.css';

/**
 * AuthModal - Login, Register, Forgot Password tabs in one modal
 * Props: isOpen, onClose, onLoginSuccess
 */
function AuthModal({ isOpen, onClose, onLoginSuccess, onToast }) {
  const { t } = useTranslation();
  const [tab, setTab]           = useState('login'); // 'login' | 'register' | 'forgot'
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [errors, setErrors]     = useState({});

  // Form states
  const [loginForm, setLoginForm]     = useState({ email: '', password: '' });
  const [regForm, setRegForm]         = useState({ first_name: '', last_name: '', username: '', email: '', password: '', password_confirmation: '' });
  const [forgotEmail, setForgotEmail] = useState('');
  const [successMsg, setSuccessMsg]   = useState('');

  if (!isOpen) return null;

  const clearAll = () => {
    setErrors({});
    setSuccessMsg('');
  };

  const switchTab = (t) => { setTab(t); clearAll(); };

  // ── Login ──────────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setErrors({}); setSuccessMsg('');
    try {
      const res = await loginUser(loginForm.email, loginForm.password);
      if (res.success) {
        if (onToast) onToast(`✅ Welcome back, ${res.data?.user?.name || ''}!`, 'success');
        if (onLoginSuccess) onLoginSuccess(res.data?.user);
        onClose();
      } else {
        setErrors({ general: res.message || 'Login failed.' });
      }
    } catch (err) {
      // err.message is already clean from auth.service.js
      setErrors({ general: err.message || 'Server error. Please try again.' });
    } finally { setLoading(false); }
  };

  // ── Register ───────────────────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    if (regForm.password !== regForm.password_confirmation) {
      setErrors({ password_confirmation: ['Passwords do not match.'] });
      return;
    }
    setLoading(true); setErrors({}); setSuccessMsg('');
    try {
      const res = await registerUser(regForm);
      if (res.success) {
        setSuccessMsg(res.message);
        if (onToast) onToast('🎉 Account created! Please log in.', 'success');
        setTimeout(() => switchTab('login'), 1800);
      } else {
        setErrors(res.errors || { general: res.message });
      }
    } catch (err) {
      const errs = err.response?.data?.errors || { general: err.response?.data?.message || 'Registration failed.' };
      setErrors(errs);
    } finally { setLoading(false); }
  };

  // ── Forgot Password ────────────────────────────────────────────────────────
  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true); setErrors({}); setSuccessMsg('');
    try {
      const res = await forgotPassword(forgotEmail);
      if (res.success) {
        setSuccessMsg(res.message);
        if (onToast) onToast('📧 Reset link sent! Check your inbox.', 'success');
      } else {
        setErrors({ general: res.message });
      }
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Could not send reset link.' });
    } finally { setLoading(false); }
  };

  const firstErr = (key) => (Array.isArray(errors[key]) ? errors[key][0] : errors[key]);

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="auth-modal-header">
          <div className="auth-logo-row">
            <span className="auth-logo-icon">🔐</span>
            <div>
              <h2 className="auth-modal-title">
                {tab === 'login'  && t('loginTitle')}
                {tab === 'register' && t('registerTitle')}
                {tab === 'forgot'  && t('forgotTitle')}
              </h2>
              <p className="auth-modal-sub">
                {tab === 'login'  && 'Access personalized news & submit reports'}
                {tab === 'register' && 'Join thousands of readers on Pravah News'}
                {tab === 'forgot'  && 'We\'ll send a reset link to your email'}
              </p>
            </div>
          </div>
          <button className="auth-close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Tabs */}
        {tab !== 'forgot' && (
          <div className="auth-tabs">
            <button className={`auth-tab-btn ${tab === 'login' ? 'active' : ''}`} onClick={() => switchTab('login')}>Login</button>
            <button className={`auth-tab-btn ${tab === 'register' ? 'active' : ''}`} onClick={() => switchTab('register')}>Register</button>
          </div>
        )}

        <div className="auth-modal-body">

          {/* ── Success Message ── */}
          {successMsg && (
            <div className="auth-success-box">
              <span>✅</span> {successMsg}
            </div>
          )}

          {/* ── General Error ── */}
          {errors.general && (
            <div className="auth-error-box">
              <span>⚠️</span> {errors.general}
            </div>
          )}

          {/* ═══════════ LOGIN FORM ═══════════ */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="auth-field">
                <label>{t('emailOrUsername')}</label>
                <input
                  type="text"
                  placeholder="you@example.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                  autoFocus
                />
                {firstErr('email') && <span className="field-err">{firstErr('email')}</span>}
              </div>

              <div className="auth-field">
                <label>{t('password')}</label>
                <div className="auth-input-row">
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                  />
                  <button type="button" className="show-pass-btn" onClick={() => setShowPass(!showPass)}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
                {firstErr('password') && <span className="field-err">{firstErr('password')}</span>}
              </div>

              <button type="button" className="auth-forgot-link" onClick={() => switchTab('forgot')}>
                {t('forgotPassword')}
              </button>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? <span className="auth-spinner" /> : `🔑 ${t('signInBtn')}`}
              </button>

              <p className="auth-switch-txt">
                {t('noAccount')}{' '}
                <button type="button" className="auth-link-btn" onClick={() => switchTab('register')}>{t('registerNow')}</button>
              </p>
            </form>
          )}

          {/* ═══════════ REGISTER FORM ═══════════ */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="auth-form">
              <div className="auth-field-row">
                <div className="auth-field">
                  <label>{t('firstName')}</label>
                  <input type="text" placeholder="First Name" value={regForm.first_name}
                    onChange={(e) => setRegForm({ ...regForm, first_name: e.target.value })} required />
                  {firstErr('first_name') && <span className="field-err">{firstErr('first_name')}</span>}
                </div>
                <div className="auth-field">
                  <label>{t('lastName')}</label>
                  <input type="text" placeholder="Last Name" value={regForm.last_name}
                    onChange={(e) => setRegForm({ ...regForm, last_name: e.target.value })} required />
                  {firstErr('last_name') && <span className="field-err">{firstErr('last_name')}</span>}
                </div>
              </div>

              <div className="auth-field">
                <label>{t('username')}</label>
                <input type="text" placeholder="Username" value={regForm.username}
                  onChange={(e) => setRegForm({ ...regForm, username: e.target.value })} required />
                {firstErr('username') && <span className="field-err">{firstErr('username')}</span>}
              </div>

              <div className="auth-field">
                <label>{t('emailAddress')}</label>
                <input type="email" placeholder="you@example.com" value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} required />
                {firstErr('email') && <span className="field-err">{firstErr('email')}</span>}
              </div>

              <div className="auth-field">
                <label>{t('password')} <span className="auth-hint">(min 6 chars)</span></label>
                <div className="auth-input-row">
                  <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} required minLength={6} />
                  <button type="button" className="show-pass-btn" onClick={() => setShowPass(!showPass)}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
                {firstErr('password') && <span className="field-err">{firstErr('password')}</span>}
              </div>

              <div className="auth-field">
                <label>{t('confirmPassword')}</label>
                <div className="auth-input-row">
                  <input type={showPass2 ? 'text' : 'password'} placeholder="••••••••" value={regForm.password_confirmation}
                    onChange={(e) => setRegForm({ ...regForm, password_confirmation: e.target.value })} required />
                  <button type="button" className="show-pass-btn" onClick={() => setShowPass2(!showPass2)}>
                    {showPass2 ? '🙈' : '👁️'}
                  </button>
                </div>
                {firstErr('password_confirmation') && <span className="field-err">{firstErr('password_confirmation')}</span>}
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? <span className="auth-spinner" /> : `🚀 ${t('createAccountBtn')}`}
              </button>

              <p className="auth-switch-txt">
                {t('haveAccount')}{' '}
                <button type="button" className="auth-link-btn" onClick={() => switchTab('login')}>{t('loginHere')}</button>
              </p>
            </form>
          )}

          {/* ═══════════ FORGOT PASSWORD FORM ═══════════ */}
          {tab === 'forgot' && (
            <form onSubmit={handleForgot} className="auth-form">
              <div className="auth-field">
                <label>{t('emailAddress')}</label>
                <input type="email" placeholder="you@example.com" value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)} required autoFocus />
                {firstErr('email') && <span className="field-err">{firstErr('email')}</span>}
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? <span className="auth-spinner" /> : `📧 ${t('sendResetLink')}`}
              </button>

              <p className="auth-switch-txt">
                <button type="button" className="auth-link-btn" onClick={() => switchTab('login')}>{t('backToLogin')}</button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
