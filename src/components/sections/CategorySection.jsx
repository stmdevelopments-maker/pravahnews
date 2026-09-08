import React from 'react';
import NewsCard from '../NewsCard';
import '../../styles/Sections.css';

function CategorySection({ categoryNews, onOpenShare, onOpenReport, onToast, onSelectCategory }) {
  if (!categoryNews || categoryNews.length === 0) return null;

  // Filter out categories with 0 articles
  const validCategories = categoryNews.filter((cat) => cat.articles && cat.articles.length > 0);
  if (validCategories.length === 0) return null;

  return (
    <div className="category-sections-wrapper animate-fade-in">
      {validCategories.map((catGroup) => {
        const catColor = catGroup.articles[0]?.category?.color || 'var(--primary, #4f46e5)';
        return (
          <section key={catGroup.categoryName} className="section-wrapper">
            <div className="section-header" style={{ borderBottomColor: catColor }}>
              <div className="section-title-box">
                <span className="section-icon" style={{ color: catColor }}>📁</span>
                <h2 className="section-title">{catGroup.categoryName} News</h2>
              </div>
              <button 
                type="button"
                className="section-view-all"
                style={{ color: catColor }}
                onClick={() => {
                  if (onSelectCategory) {
                    onSelectCategory(catGroup.articles[0]?.category?.slug || 'all');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
              >
                View All {catGroup.categoryName} ›
              </button>
            </div>

            <div className="news-grid-4">
              {catGroup.articles.map((art) => (
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
          </section>
        );
      })}
    </div>
  );
}

export default React.memo(CategorySection);
