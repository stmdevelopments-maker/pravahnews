/**
 * ============================================================================
 * MAIN APPLICATION COMPONENT (App.jsx) - Dailyhunt & Pravah API Edition
 * ============================================================================
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import BreakingTicker from './components/BreakingTicker';
import Footer from './components/Footer';
import Home from './pages/Home';

const Profile = lazy(() => import('./pages/Profile'));
const StaticPage = lazy(() => import('./pages/StaticPage'));
const ShareModal = lazy(() => import('./components/ShareModal'));
const ReportModal = lazy(() => import('./components/ReportModal'));
const AddChannelModal = lazy(() => import('./components/AddChannelModal'));
const ArticleModal = lazy(() => import('./components/ArticleModal'));
const AuthModal = lazy(() => import('./components/AuthModal'));
const Chatbot = lazy(() => import('./components/Chatbot'));
import { getHomeNews, getLiveChannels, addLiveChannel } from './services/news.service';
import { getUser, isLoggedIn, logoutUser } from './services/auth.service';
import { useTranslation } from './hooks/useTranslation';
import './App.css';

function App() {
  // 1. Theme State: Initialize from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Helper: get current hash-based route
  const getHashRoute = () => {
    const hash = window.location.hash || '';
    // hash looks like "#/privacy-policy" or "#/profile" or "" (home)
    return hash.startsWith('#') ? hash.slice(1) : '/';
  };

  // 2. Navigation & Filter State
  const [currentRoute, setCurrentRoute] = useState(() => getHashRoute());
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('c') || 'all';
    }
    return 'all';
  });
  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('q') || '';
    }
    return '';
  });
  
  // 3. Async News Data State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newsData, setNewsData] = useState({
    slider: [],
    breaking: [],
    latest: [],
    featured: [],
    trending: [],
    categoryNews: [],
    popular: [],
    videos: [],
    photos: [],
    editorsPick: [],
    mostRead: [],
    allArticles: [],
    ads: [],
  });
  
  const [originalNewsData, setOriginalNewsData] = useState(null);

  // 4. Live Video Channels State
  const [liveChannels, setLiveChannels] = useState(() => getLiveChannels());

  // 5. Auth State
  const [authUser, setAuthUser] = useState(() => getUser());
  const [authModal, setAuthModal] = useState({ isOpen: false, tab: 'login' });

  // 6. Modals State
  const [shareModal, setShareModal]   = useState({ isOpen: false, article: null });
  const [reportModal, setReportModal] = useState({ isOpen: false, article: null });
  const [articleModal, setArticleModal] = useState({ isOpen: false, article: null });
  const [addChannelModal, setAddChannelModal] = useState(false);

  // 7. Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3500);
  };

  // 8. Language State from Context
  const { language, translateDynamicNews, setIsTranslating } = useTranslation();

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getHomeNews('hi');
      const payload = response.data?.data || {};
      setNewsData(payload); // Directly set newsData
    } catch (err) {
      console.error('Failed to fetch news:', err);
      setError('Unable to reach Pravah live server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Background translation logic has been removed.
  // We now rely on the robust Google Translate DOM widget in index.html

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Global event listener for opening articles (to avoid prop drilling)
  useEffect(() => {
    const handleOpenArticle = (e) => {
      if (e.detail) {
        setArticleModal({ isOpen: true, article: e.detail });
      }
    };
    window.addEventListener('openArticle', handleOpenArticle);
    return () => window.removeEventListener('openArticle', handleOpenArticle);
  }, []);

  // Listen for hash changes to update the route
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(getHashRoute());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleAddChannelSubmit = (newChannel) => {
    const updated = addLiveChannel(newChannel);
    setLiveChannels(updated);
  };

  const staticRoutes = [
    '/about-us', '/contact', '/editorial-policy', '/privacy-policy', 
    '/terms-conditions', '/rules', '/refund-policy', '/cancellation', 
    '/faq', '/notifications', '/support'
  ];
  const normalizedPath = currentRoute || '/';
  const isStaticPage = staticRoutes.includes(normalizedPath);

  return (
    <div className="app-wrapper">
      {/* Toast Notification Banner */}
      {toast.show && (
        <div className={`toast-popup toast-${toast.type} animate-fade-in`}>
          <span>{toast.message}</span>
          <button onClick={() => setToast({ show: false, message: '', type: 'info' })} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 800 }}>✕</button>
        </div>
      )}

      {/* Top Header */}
      <Header 
        darkMode={darkMode} 
        onToggleTheme={toggleTheme} 
        onSearch={(q) => {
          if (normalizedPath !== '/') {
            window.location.hash = '#/';
            setTimeout(() => {
              setSearchQuery(q);
              if (q) setSelectedCategory('all');
            }, 50);
            return;
          }
          setSearchQuery(q);
          if (q) setSelectedCategory('all');
        }}
        authUser={authUser}
        onOpenAuth={() => setAuthModal({ isOpen: true })}
        onLogout={async () => {
          await logoutUser();
          setAuthUser(null);
          showToast('👋 Logged out successfully.', 'info');
        }}
        activeCategory={selectedCategory}
        onSelectCategory={(cat) => {
          if (normalizedPath !== '/') {
            window.location.hash = '#/';
          }
          setSelectedCategory(cat);
          if (cat !== 'all') setSearchQuery('');
        }}
      />

      <Navbar 
        activeCategory={selectedCategory} 
        onSelectCategory={(cat) => {
          if (normalizedPath !== '/') {
            window.location.hash = '#/';
          }
          setSelectedCategory(cat);
          if (cat !== 'all') setSearchQuery('');
          if (cat === 'livetv') {
            showToast('Switching to 24/7 Live Video Hub 📺', 'info');
          }
        }}
        onOpenAddChannel={() => setAddChannelModal(true)}
      />
      
      {/* Breaking News Ticker (When viewing all categories without active search) */}
      {!loading && !error && newsData.breaking?.length > 0 && selectedCategory === 'all' && !searchQuery && (
        <BreakingTicker news={newsData.breaking} />
      )}

      {/* Main Content Area */}
      <Suspense fallback={<div className="loading-container" style={{ padding: '2rem 0' }}><div className="section-header"><h2 className="section-title">Loading...</h2></div></div>}>
        {normalizedPath === '/profile' ? (
          <Profile authUser={authUser} onLogout={async () => {
            await logoutUser();
            setAuthUser(null);
            showToast('👋 Logged out successfully.', 'info');
          }} />
        ) : isStaticPage ? (
          <StaticPage />
        ) : (
          <Home 
            newsData={newsData}
            loading={loading}
            error={error}
            onRetry={fetchNews}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            liveChannels={liveChannels}
            onSelectCategory={setSelectedCategory}
            onOpenShare={(art) => setShareModal({ isOpen: true, article: art })}
            onOpenReport={(art) => setReportModal({ isOpen: true, article: art })}
            onOpenArticle={(art) => setArticleModal({ isOpen: true, article: art })}
            onOpenAddChannel={() => setAddChannelModal(true)}
            onToast={showToast}
          />
        )}
      </Suspense>

      {/* Mobile Ergonomics Bottom Navigation Bar */}
      <BottomNav 
        activeCategory={selectedCategory}
        onSelectCategory={(cat) => {
          if (normalizedPath !== '/') {
            window.location.hash = '#/';
          }
          setSelectedCategory(cat);
          if (cat !== 'all') setSearchQuery('');
        }}
        onOpenAddChannel={() => setAddChannelModal(true)}
      />

      {/* Footer */}
      <Footer />

      {/* Interactive Modals */}
      <Suspense fallback={null}>
        <ShareModal 
          isOpen={shareModal.isOpen}
          article={shareModal.article}
          onClose={() => setShareModal({ isOpen: false, article: null })}
          onToast={showToast}
        />

        <ReportModal 
          isOpen={reportModal.isOpen}
          article={reportModal.article}
          onClose={() => setReportModal({ isOpen: false, article: null })}
          onToast={showToast}
        />

        <ArticleModal 
          isOpen={articleModal.isOpen}
          article={articleModal.article}
          onClose={() => setArticleModal({ isOpen: false, article: null })}
          onToast={showToast}
        />
        
        <AddChannelModal 
          isOpen={addChannelModal}
          onClose={() => setAddChannelModal(false)}
          onAddChannel={handleAddChannelSubmit}
          onToast={showToast}
        />

        {/* Auth Modal - Login / Register / Forgot Password */}
        <AuthModal
          isOpen={authModal.isOpen}
          onClose={() => setAuthModal({ isOpen: false })}
          onLoginSuccess={(user) => {
            setAuthUser(user);
            showToast(`✅ Welcome, ${user?.name || 'User'}!`, 'success');
          }}
          onToast={showToast}
        />

        {/* Gemini AI Chatbot */}
        <Chatbot />
      </Suspense>
    </div>

  );
}

export default App;