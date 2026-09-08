import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import '../styles/Footer.css';

function Footer() {
  const { t, language } = useTranslation();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL || 'http://localhost:5173';

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-grid">
          
          {/* Column 1: Brand & Mission */}
          <div className="footer-col brand-col">
            <div className="footer-logo-wrapper" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img 
                src="https://pravahnews.com/public/uploads/logo/1352/WhatsApp-Image-2025-12-18-at-4.38.02-PM-removebg-preview.png" 
                alt="Pravah News" 
                className="brand-logo-img"
              />
            </div>
            <p className="footer-bio">
              प्रवाह एक विश्वसनीय डिजिटल न्यूज़ प्लेटफ़ॉर्म है, जहाँ आपको देश-विदेश की ताज़ा खबरें, राजनीति, समाज, शिक्षा, खेल और समसामयिक विषयों की निष्पक्ष व सटीक जानकारी मिलती है। हमारा उद्देश्य सच्ची खबरों को सरल भाषा में आप तक पहुँचाना और समाज को जागरूक बनाना है। यहाँ आपको राजनीति, समाज, शिक्षा, खेल और देश-दुनिया की हर महत्वपूर्ण खबर एक ही जगह मिलेगी।
            </p>
            <div className="social-links">
              <a href="#" className="social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
              <a href="#" className="social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Dynamic Categories */}
          <div className="footer-col categories-col">
            <h4 className="footer-heading">
              Dynamic Categories
              <span className="heading-underline"></span>
            </h4>
            <div className="category-pills-grid">
              <a href="#" className="cat-pill"><span className="cat-icon">🔥</span> प्रमुख-समाचार</a>
              <a href="#" className="cat-pill"><span className="cat-icon">📌</span> राष्ट्रीय</a>
              <a href="#" className="cat-pill"><span className="cat-icon">🎬</span> मनोरंजन</a>
              <a href="#" className="cat-pill"><span className="cat-icon">📌</span> अंतरराष्ट्रीय</a>
              <a href="#" className="cat-pill"><span className="cat-icon">📈</span> व्यापार</a>
              <a href="#" className="cat-pill"><span className="cat-icon">✨</span> ज्योतिष</a>
              <a href="#" className="cat-pill"><span className="cat-icon">🕌</span> धर्म</a>
              <a href="#" className="cat-pill"><span className="cat-icon">📌</span> मुख्य पृष्ठ</a>
              <a href="#" className="cat-pill"><span className="cat-icon">🏛️</span> राजनीति</a>
            </div>
          </div>

          {/* Column 3: Newsletter */}
          <div className="footer-col newsletter-col">
            <h4 className="footer-heading">
              Subscribe to our newsletter
              <span className="heading-underline"></span>
            </h4>
            <p className="footer-text">
              Get top daily headlines and breaking news alerts directly in your inbox.
            </p>
            <form className="newsletter-form-modern" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                placeholder="Enter your email address..." 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary newsletter-btn-full">
                Subscribe Now
              </button>
              {subscribed && <span className="newsletter-success">Subscribed successfully!</span>}
            </form>
          </div>
          
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <div className="footer-copyright">
            All Rights Reserved ©2026 | <strong>Pravah News</strong>
          </div>
          <div className="footer-bottom-links">
            <a href="#"><span className="link-icon">🔒</span> Privacy Policy</a>
            <a href="#"><span className="link-icon">📝</span> Rules & Regulations</a>
            <a href="#"><span className="link-icon">💸</span> Refund Policy</a>
            <a href="#"><span className="link-icon">❌</span> Cancellation</a>
            <a href="#"><span className="link-icon">❓</span> FAQ</a>
            <a href="#"><span className="link-icon">💬</span> Help & Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
