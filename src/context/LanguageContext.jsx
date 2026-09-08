// src/context/LanguageContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    const match = document.cookie.match(/googtrans=\/hi\/(en|hi)/);
    return match ? match[1] : 'hi';
  });
  const [isTranslating, setIsTranslating] = useState(false);

  const setLanguage = (lang) => {
    setLanguageState(lang);
    const combo = lang === 'hi' ? '/hi/hi' : '/hi/en';
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=${combo}; path=/`;
    document.cookie = `googtrans=${combo}; path=/; domain=${window.location.hostname}`;
    window.location.reload();
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isTranslating, setIsTranslating }}>
      {children}
    </LanguageContext.Provider>
  );
};
