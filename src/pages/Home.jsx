import React, { useMemo } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import HeroSlider from '../components/HeroSlider';
import BreakingSection from '../components/sections/BreakingSection';
import FeaturedSection from '../components/sections/FeaturedSection';
import TrendingSection from '../components/sections/TrendingSection';
import LatestSection from '../components/sections/LatestSection';
import CategorySection from '../components/sections/CategorySection';
import PopularSection from '../components/sections/PopularSection';
import EditorsPickSection from '../components/sections/EditorsPickSection';
import PhotoGallerySection from '../components/sections/PhotoGallerySection';
import VideoSection from '../components/sections/VideoSection';
import AdCard from '../components/AdCard';

import SkeletonLoader from '../components/SkeletonLoader';
import '../styles/Home.css';

function Home({
  newsData = {},
  loading = false,
  error = null,
  onRetry,
  selectedCategory = 'all',
  searchQuery = '',
  liveChannels = [],
  onSelectCategory,
  onOpenShare,
  onOpenReport,
  onOpenArticle,
  onOpenAddChannel,
  onToast
}) {
  const { t, isTranslating } = useTranslation();

  const {
    slider = [],
    breaking = [],
    latest = [],
    featured = [],
    trending = [],
    categoryNews = [],
    popular = [],
    videos = [],
    photos = [],
    editorsPick = [],
    mostRead = [],
    allArticles = [],
    ads = [],
  } = newsData;

  const generateNativeAd = (ad, index) => {
    if (!ad) return null;
    return {
      id: `native-ad-${index}-${ad.id || Math.random()}`,
      title: ad.title || ad.headline || 'Sponsored Content',
      description: ad.description || ad.ad_description,
      post_image: ad.image || ad.bannerUrl || ad.ad_banner,
      category: { name: 'Sponsored', color: '#e11d48' },
      user: { full_name: ad.advertiser || 'Brand Partner' },
      created_at: new Date().toISOString(),
      isAd: true,
      link: ad.link || ad.ad_url
    };
  };

  const featuredWithAds = useMemo(() => {
    const list = [...featured];
    if (ads && ads.length > 0 && list.length >= 2) {
      list.splice(1, 0, generateNativeAd(ads[0], 0));
    }
    return list;
  }, [featured, ads]);

  const trendingWithAds = useMemo(() => {
    const list = [...trending];
    if (ads && ads.length > 1 && list.length >= 3) {
      list.splice(2, 0, generateNativeAd(ads[1], 1));
    } else if (ads && ads.length > 0 && list.length >= 3) {
      list.splice(2, 0, generateNativeAd(ads[0], 1));
    }
    return list;
  }, [trending, ads]);

  // Filter articles based on search query and selected category
  const filteredArticles = useMemo(() => {
    let list = [...(allArticles.length > 0 ? allArticles : latest)];

    if (selectedCategory && selectedCategory !== 'all' && selectedCategory !== 'livetv') {
      const translatedCat = t(selectedCategory).toLowerCase();

      list = list.filter((item) => {
        const catName = item.category?.name?.toLowerCase() || '';
        const catSlug = item.category?.slug?.toLowerCase() || '';
        const tags = item.tags?.toLowerCase() || '';
        return (
          catName.includes(selectedCategory.toLowerCase()) ||
          catSlug.includes(selectedCategory.toLowerCase()) ||
          tags.includes(selectedCategory.toLowerCase()) ||
          catName.includes(translatedCat) ||
          catSlug.includes(translatedCat) ||
          tags.includes(translatedCat)
        );
      });
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      list = list.filter((item) => {
        const title = item.title?.toLowerCase() || '';
        const desc = item.description?.toLowerCase() || '';
        const keywords = item.keywords?.toLowerCase() || '';
        return title.includes(query) || desc.includes(query) || keywords.includes(query);
      });
    }

    return list;
  }, [allArticles, latest, selectedCategory, searchQuery]);

  return (
    <main className="home-page main-content">
      <div className="container">
        {/* Loading State - Skeletons */}
        {loading && (
          <div className="loading-container" style={{ padding: '2rem 0' }}>
            <SkeletonLoader type="hero" count={1} />
            <div className="section-header" style={{ marginTop: '2.5rem' }}>
              <h2 className="section-title">{isTranslating ? t('translating') : 'Loading...'}</h2>
            </div>
            <SkeletonLoader type="card" count={8} />
          </div>
        )}

        {/* Error State - Graceful Fallback Banner */}
        {!loading && error && (
          <div className="error-banner glass-panel animate-fade-in" style={{ margin: '2rem 0' }}>
            <div className="error-icon">⚠️</div>
            <div className="error-content">
              <h3>Notice: Using Offline / Fallback Journalism Feed</h3>
              <p>{error} — We have automatically loaded our curated English news dataset so your reading experience is uninterrupted.</p>
            </div>
            {onRetry && (
              <button className="btn btn-primary retry-btn" onClick={onRetry}>
                🔄 Retry API Connection
              </button>
            )}
          </div>
        )}

        {/* Loaded State */}
        {!loading && (
          <>


            {/* Filter / Search Status Bar (for regular categories or search) */}
            {(selectedCategory !== 'all' && selectedCategory !== 'livetv' || searchQuery) && (
              <div className="filter-status-bar animate-fade-in" style={{ margin: '1.5rem 0' }}>
                <div className="filter-status-left">
                  <span>Showing journalism for:</span>
                  {selectedCategory !== 'all' && (
                    <span className="filter-badge">
                      Category: <strong>{selectedCategory.toUpperCase()}</strong>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="filter-badge">
                      Search: <strong>"{searchQuery}"</strong>
                    </span>
                  )}
                </div>
                <button
                  className="clear-filters-btn"
                  onClick={() => {
                    if (onSelectCategory) onSelectCategory('all');
                  }}
                >
                  Reset Filters ✕
                </button>
              </div>
            )}

            {/* When viewing filtered results or category feed */}
            {(selectedCategory !== 'all' && selectedCategory !== 'livetv' || searchQuery) && (
              filteredArticles.length > 0 ? (
                <LatestSection
                  latest={filteredArticles}
                  ads={ads}
                  onOpenShare={onOpenShare}
                  onOpenReport={onOpenReport}
                  onOpenArticle={onOpenArticle}
                  onToast={onToast}
                />
              ) : (
                <div className="empty-state glass-panel animate-fade-in" style={{ margin: '3rem 0', textAlign: 'center', padding: '3rem 1.5rem' }}>
                  <div className="empty-icon" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📰</div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>No matching stories found</h3>
                  <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0.5rem auto 1.5rem' }}>
                    We couldn't find any articles matching your search or category filter. Try clearing filters or exploring our top stories.
                  </p>
                  <button className="btn btn-primary" onClick={() => onSelectCategory && onSelectCategory('all')}>
                    Explore All Headlines
                  </button>
                </div>
              )
            )}

            {/* LIVE TV SECTION */}
            {selectedCategory === 'livetv' && (
              <div style={{ margin: '2rem 0' }}>
                <VideoSection
                  videos={videos}
                  liveChannels={liveChannels}
                  onOpenAddChannel={onOpenAddChannel}
                  onOpenShare={onOpenShare}
                  onOpenReport={onOpenReport}
                  onToast={onToast}
                />
              </div>
            )}

            {/* MAIN HOMEPAGE FEED (When selectedCategory === 'all' and no search query) */}
            {selectedCategory === 'all' && !searchQuery && (
              <div className="homepage-sections-stack" style={{ paddingTop: '1.5rem' }}>
                {/* 1. Hero / Top Headlines */}
                <HeroSlider
                  sliderNews={slider}
                  onOpenArticle={onOpenArticle}
                />

                {/* 2. Breaking News */}
                <BreakingSection
                  breaking={breaking}
                  onOpenShare={onOpenShare}
                  onOpenReport={onOpenReport}
                  onOpenArticle={onOpenArticle}
                  onToast={onToast}
                />

                {/* 3. Featured Stories */}
                <FeaturedSection
                  featured={featuredWithAds}
                  onOpenShare={onOpenShare}
                  onOpenReport={onOpenReport}
                  onOpenArticle={onOpenArticle}
                  onToast={onToast}
                />

                {/* Ad Placement 1 */}
                {ads && ads.length > 0 && (
                  <div style={{ margin: '2rem 0', display: 'flex', justifyContent: 'center' }}>
                    <AdCard ads={ads} onToast={onToast} />
                  </div>
                )}

                {/* 4. Trending News */}
                <TrendingSection
                  trending={trendingWithAds}
                  onOpenShare={onOpenShare}
                  onOpenReport={onOpenReport}
                  onOpenArticle={onOpenArticle}
                  onToast={onToast}
                />



                {/* 6. Category-wise News */}
                <CategorySection
                  categoryNews={categoryNews}
                  onOpenShare={onOpenShare}
                  onOpenReport={onOpenReport}
                  onOpenArticle={onOpenArticle}
                  onToast={onToast}
                  onSelectCategory={onSelectCategory}
                />

                {/* Ad Placement 2 */}
                {ads && ads.length > 0 && (
                  <div style={{ margin: '2rem 0', display: 'flex', justifyContent: 'center' }}>
                    <AdCard ads={ads} onToast={onToast} />
                  </div>
                )}

                {/* 7. Popular & Most Read News */}
                <PopularSection
                  popular={popular}
                  mostRead={mostRead}
                  onOpenShare={onOpenShare}
                  onOpenReport={onOpenReport}
                  onOpenArticle={onOpenArticle}
                  onToast={onToast}
                />

                {/* 8. Editors' Picks */}
                <EditorsPickSection
                  editorsPick={editorsPick}
                  onOpenShare={onOpenShare}
                  onOpenReport={onOpenReport}
                  onOpenArticle={onOpenArticle}
                  onToast={onToast}
                />

                {/* 9. Photo Gallery */}
                <PhotoGallerySection
                  photos={photos}
                  onToast={onToast}
                />

                {/* 10. Latest News & All Stories (with Dynamic Ad Injection every 4 items) */}
                <LatestSection
                  latest={latest.length > 0 ? latest : allArticles}
                  ads={ads}
                  onOpenShare={onOpenShare}
                  onOpenReport={onOpenReport}
                  onOpenArticle={onOpenArticle}
                  onToast={onToast}
                />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default Home;