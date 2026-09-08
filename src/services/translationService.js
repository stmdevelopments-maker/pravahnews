// src/services/translationService.js

/**
 * Multi-Provider Translation Service
 * 1. Primary: Google Translate (via Vite proxy)
 * 2. Secondary: MyMemory Translated API (Immediate Fallback on 429 or error)
 * 3. Tertiary: Lingva Open Engine
 * 4. Multi-tier caching (Memory + sessionStorage)
 */

const CACHE_PREFIX = 'trans_cache_';
const memCache = new Map();
let isRateLimited = false; // Circuit breaker for 429s

// Get cached translation
const getCached = (key) => {
  if (memCache.has(key)) return memCache.get(key);
  try {
    // Switch to localStorage for permanent caching to save API calls
    const val = localStorage.getItem(CACHE_PREFIX + key);
    if (val) {
      memCache.set(key, val);
      return val;
    }
  } catch (e) {}
  return null;
};

// Save to cache
const setCached = (key, val) => {
  if (!val || typeof val !== 'string') return;
  memCache.set(key, val);
  try {
    localStorage.setItem(CACHE_PREFIX + key, val);
  } catch (e) {}
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Provider 1: Google Translate
 */
const translateWithGoogle = async (text, targetLang, sourceLang = 'hi') => {
  try {
    const url = `/translate-api/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `q=${encodeURIComponent(text)}`
    });
    if (!response.ok) return null;
    const data = await response.json();
    if (Array.isArray(data) && Array.isArray(data[0])) {
      return data[0].map((item) => item[0]).join('');
    }
  } catch (e) {
    console.warn(`[Translation] Google Primary failed: ${e.message}`);
  }
  return null;
};

/**
 * Provider 2: Alternate Google Translate (clients5)
 */
const translateWithGoogleFallback = async (text, targetLang, sourceLang = 'hi') => {
  try {
    const url = `/translate-api-fallback/translate_a/t?client=dict-chrome-ex&sl=${sourceLang}&tl=${targetLang}&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    if (Array.isArray(data)) {
      if (typeof data[0] === 'string') return data.join('');
      return data.map(item => Array.isArray(item) ? item[0] : item).join('');
    }
    if (typeof data === 'string') return data;
  } catch (e) {
    console.warn(`[Translation] Google Fallback failed: ${e.message}`);
  }
  return null;
};

/**
 * Provider 3: MyMemory API (Free & reliable fallback)
 */
const translateWithMyMemory = async (text, targetLang, sourceLang = 'hi') => {
  try {
    const url = `https://api.mymemory.translated.net/get?langpair=${sourceLang}|${targetLang}&de=contact@pravahnews.com`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `q=${encodeURIComponent(text)}`
    });
    if (!response.ok) return null;
    const data = await response.json();
    if (data && data.responseData && data.responseData.translatedText) {
      const result = data.responseData.translatedText;
      if (!result.startsWith('MYMEMORY WARNING')) {
        return result;
      }
    }
  } catch (e) {
    console.warn(`[Translation] MyMemory failed: ${e.message}`);
  }
  return null;
};

/**
 * Provider 4: Lingva API
 */
const translateWithLingva = async (text, targetLang, sourceLang = 'hi') => {
  try {
    const url = `https://lingva.ml/api/v1/${sourceLang}/${targetLang}/${encodeURIComponent(text)}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    if (data && data.translation) {
      return data.translation;
    }
  } catch (e) {
    console.warn(`[Translation] Lingva failed: ${e.message}`);
  }
  return null;
};

/**
 * Multi-Engine Fetcher: Tries Google Primary -> Google Fallback -> MyMemory -> Lingva
 */
const fetchTranslation = async (text, targetLang, sourceLang = 'hi') => {
  if (!text || typeof text !== 'string' || !text.trim() || isRateLimited) return text;

  // 1. Try Google Translate Primary
  let translated = await translateWithGoogle(text, targetLang, sourceLang);
  if (translated && translated.trim()) return translated;

  // 2. Try Google Translate Secondary (clients5)
  translated = await translateWithGoogleFallback(text, targetLang, sourceLang);
  if (translated && translated.trim()) return translated;

  // 3. Try MyMemory
  translated = await translateWithMyMemory(text, targetLang, sourceLang);
  if (translated && translated.trim()) return translated;

  // 4. Try Lingva
  translated = await translateWithLingva(text, targetLang, sourceLang);
  if (translated && translated.trim()) return translated;

  // If all APIs failed, it usually means our IP is globally rate-limited (429)
  console.warn('[Translation] All endpoints failed. Will retry on next request.');
  // Removed permanent circuit breaker (isRateLimited = true) to allow recovery
  
  // Return original text if all fail
  return text;
};

/**
 * Translates a single text
 */
export const translateText = async (text, targetLang, sourceLang = 'hi') => {
  if (!text || typeof text !== 'string' || !text.trim()) return text;
  if (targetLang === sourceLang) return text;

  const cacheKey = `${sourceLang}_${targetLang}_${text.trim()}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const translated = await fetchTranslation(text, targetLang, sourceLang);
  setCached(cacheKey, translated);
  return translated;
};

/**
 * Batch translation with delimiter (Bundles multiple texts into single API request)
 */
export const translateBatchTexts = async (texts, targetLang, sourceLang = 'hi') => {
  if (!texts || !texts.length || targetLang === sourceLang) return texts;

  const results = new Array(texts.length);
  const uncachedIndices = [];
  const uncachedTexts = [];

  texts.forEach((txt, idx) => {
    if (!txt || typeof txt !== 'string' || !txt.trim()) {
      results[idx] = txt;
      return;
    }
    const key = `${sourceLang}_${targetLang}_${txt.trim()}`;
    const cached = getCached(key);
    if (cached) {
      results[idx] = cached;
    } else {
      uncachedIndices.push(idx);
      uncachedTexts.push(txt.trim());
    }
  });

  if (uncachedTexts.length === 0) {
    return results;
  }

  const DELIMITER = '\n\n';
  const MAX_CHARS = 3800; // Safe limit under Google's 5000 char limit

  let i = 0;
  while (i < uncachedTexts.length) {
    let currentBatchTexts = [];
    let currentBatchIndices = [];
    let currentLength = 0;

    // Build a batch that doesn't exceed MAX_CHARS
    while (i < uncachedTexts.length) {
      const textLen = uncachedTexts[i].length + DELIMITER.length;
      if (currentLength + textLen > MAX_CHARS && currentBatchTexts.length > 0) {
        break; // Batch is full
      }
      currentBatchTexts.push(uncachedTexts[i]);
      currentBatchIndices.push(uncachedIndices[i]);
      currentLength += textLen;
      i++;
    }

    const combinedText = currentBatchTexts.join(DELIMITER);
    await sleep(Math.floor(Math.random() * 300) + 200); 
    const translatedCombined = await fetchTranslation(combinedText, targetLang, sourceLang);

    // Split by double newlines
    let translatedParts = [];
    if (translatedCombined) {
      translatedParts = translatedCombined.split(/\n\n+/);
    }

    currentBatchIndices.forEach((origIdx, sliceIdx) => {
      const origText = currentBatchTexts[sliceIdx];
      const translatedPart = translatedParts[sliceIdx] || origText;
      
      // Only cache if it actually translated (didn't fallback to original due to failure)
      if (translatedPart !== origText && !isRateLimited) {
        const key = `${sourceLang}_${targetLang}_${origText}`;
        setCached(key, translatedPart);
      }
      
      results[origIdx] = translatedPart;
    });

    if (isRateLimited) {
      // Circuit breaker is disabled, we just wait a bit longer on failure
      await sleep(2000);
    }

    if (i < uncachedTexts.length) {
      await sleep(2000); // Increased to 2 seconds to be extremely safe
    }
  }

  return results;
};

/**
 * Translates a single news item
 */
export const translateNewsItem = async (newsItem, targetLang) => {
  if (!newsItem || targetLang === 'hi') return newsItem;

  const translatedNews = { ...newsItem };
  const rawDescription = newsItem.description || newsItem.headline || newsItem.short_description || '';
  const cleanDescription = typeof rawDescription === 'string' ? rawDescription.replace(/<[^>]*>?/gm, '').trim() : '';

  const textsToTranslate = [
    newsItem.title || '',
    newsItem.category_name || newsItem.category?.name || '',
    cleanDescription
  ];

  const [tTitle, tCategory, tHeadline] = await translateBatchTexts(textsToTranslate, targetLang);

  translatedNews.title = tTitle || newsItem.title;
  if (tCategory && newsItem.category_name) translatedNews.category_name = tCategory;
  if (tHeadline && (newsItem.description || newsItem.headline || newsItem.short_description)) {
    translatedNews.description = tHeadline;
    translatedNews.headline = tHeadline;
    translatedNews.short_description = tHeadline;
  }

  return translatedNews;
};

/**
 * High-speed batch translation for an array of news items
 */
export const translateNewsBatch = async (newsList, targetLang) => {
  if (!newsList || !Array.isArray(newsList) || !newsList.length || targetLang === 'hi') {
    return newsList;
  }

  const titles = newsList.map((item) => item.title || '');
  const headlines = newsList.map((item) => {
    const raw = item.description || item.headline || item.short_description || '';
    return typeof raw === 'string' ? raw.replace(/<[^>]*>?/gm, '').replace(/\n/g, ' ').trim() : '';
  });
  const categories = newsList.map((item) => item.category_name || item.category?.name || '');

  const translatedTitles = await translateBatchTexts(titles, targetLang);
  const translatedHeadlines = await translateBatchTexts(headlines, targetLang);
  const translatedCategories = await translateBatchTexts(categories, targetLang);

  return newsList.map((item, idx) => {
    const tItem = {
      ...item,
      title: translatedTitles[idx] || item.title,
      description: translatedHeadlines[idx] || item.description,
      headline: translatedHeadlines[idx] || item.headline,
      short_description: translatedHeadlines[idx] || item.short_description
    };
    if (translatedCategories[idx]) {
      tItem.category_name = translatedCategories[idx];
      if (tItem.category) {
        tItem.category = { ...tItem.category, name: translatedCategories[idx] };
      }
    }
    return tItem;
  });
};

/**
 * Translates full article content
 */
export const translateFullArticle = async (article, targetLang) => {
  if (!article || targetLang === 'hi') return article;

  const translated = await translateNewsItem(article, targetLang);

  if (article.content) {
    const chunks = article.content.match(/[\s\S]{1,800}(?=\s|$)/g) || [article.content];
    const translatedChunks = [];

    for (const chunk of chunks) {
      if (!chunk.trim()) continue;
      const transChunk = await translateText(chunk, targetLang);
      translatedChunks.push(transChunk);
      await sleep(40);
    }

    translated.content = translatedChunks.join('');
  }

  return translated;
};
