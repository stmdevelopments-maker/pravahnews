import axios from "axios";
import { INITIAL_LIVE_CHANNELS } from "./newsData";

const CHANNELS_STORAGE_KEY = "pravah_live_channels_v1";
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://pravahnews.com/api";
const API_URL = `${API_BASE_URL}/home`;
// Laravel backend base URL for resolving relative image paths
const LARAVEL_BASE = import.meta.env.VITE_LARAVEL_URL || "https://pravahnews.com";

/**
 * Converts a relative image path from Laravel to a full URL.
 */
const resolveImageUrl = (path) => {
  if (!path || typeof path !== 'string') return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) return path;
  // Laravel stores images like "uploads/posts/xyz.jpg" — prepend public dir
  return `${LARAVEL_BASE}/public/${path.replace(/^\/+/, '')}`;
};

/**
 * Sanitizes and normalizes article data from the API.
 * Ensures consistent data formatting without generating fake or random metrics.
 */
const HIDDEN_AUTHOR_NAMES = ['super admin', 'admin', 'administrator', 'root', 'superadmin'];

const sanitizeArticle = (item, defaultCategory = "News", defaultColor = "#4f46e5") => {
  if (!item || typeof item !== "object") return null;

  const title = item.title || item.name || item.headline || "";
  const content = item.description || item.content || item.summary || "";
  const rawImage = item.post_image || item.image || item.thumbnail || item.photo || "";

  // If there is no title, no content, or no image, discard this news article completely
  if (!title.trim() || !content.trim() || !rawImage.trim()) {
    return null;
  }

  const finalImage = resolveImageUrl(rawImage);

  // Hide system/admin author names
  const rawAuthorName = item.user?.full_name || item.user?.name || item.author || "";
  const isAdminName = HIDDEN_AUTHOR_NAMES.some(n => rawAuthorName.toLowerCase().includes(n));
  const cleanAuthorName = (!rawAuthorName || isAdminName) ? "" : rawAuthorName;
  const cleanAuthorImg  = isAdminName ? "" : (item.user?.profile_image || item.author_image || "");

  return {
    ...item,
    id: item.id || item.slug || `article-${Date.now()}`,
    title: title,
    description: content,
    post_image: finalImage,
    category: {
      name: item.category?.name || item.category_name || defaultCategory,
      slug: item.category?.slug || item.category_slug || defaultCategory.toLowerCase().replace(/\s+/g, "-"),
      color: item.category?.color || defaultColor,
    },
    created_at: item.created_at || item.updated_at || item.date || "",
    user: {
      full_name: cleanAuthorName,
      profile_image: cleanAuthorImg,
    },
    views: item.views || item.view_count || 0,
    likes: item.likes || item.like_count || 0,
    slug: item.slug || item.id || "",
  };
};



export const getHomeNews = async (language = 'hi') => {
  let payload = {};
  let adsPayload = [];

  try {
    // Fetch both home news and ads concurrently from the local backend
    // Notice: We do NOT append ?language=en here because the DB only has Hindi content.
    // Instead, we always fetch the Hindi content and rely entirely on Google Translate on the frontend.
    const [newsRes, adsRes] = await Promise.allSettled([
      axios.get(`${API_URL}`, { timeout: 30000 }),
      axios.get(`${API_BASE_URL}/ad-spaces`, { timeout: 30000 })
    ]);

    if (newsRes.status === 'fulfilled' && newsRes.value.data) {
      payload = newsRes.value.data.data || newsRes.value.data;
      console.log("✅ Successfully loaded Home API data from:", API_URL);
    }

    if (adsRes.status === 'fulfilled' && adsRes.value.data) {
      adsPayload = adsRes.value.data.data || adsRes.value.data;
      console.log("✅ Successfully loaded Ads API data.");
    }
  } catch (err) {
    console.error("❌ API fetch failed:", err.message);
    throw new Error("Unable to reach Pravah live server.");
  }

  if (Object.keys(payload).length === 0) {
    throw new Error("No news data received from server.");
  }

  // Helper: extract array from possibly-paginated Laravel response
  const extractArray = (val) => {
    if (Array.isArray(val)) return val;
    // Handle Laravel paginated response: { data: [...], current_page: ... }
    if (val && typeof val === 'object' && Array.isArray(val.data)) return val.data;
    return [];
  };

  // 1. Extract raw arrays from API payload (checking all common section keys)
  // If any section is not returned by the API, keep it as an empty array [] without static fallbacks.
  const rawSlider = extractArray(payload.slider).length > 0 ? extractArray(payload.slider) : extractArray(payload.top_headlines);
  const rawBreaking = extractArray(payload.breaking).length > 0 ? extractArray(payload.breaking) : extractArray(payload.breaking_news);
  const rawFeatured = extractArray(payload.featured).length > 0 ? extractArray(payload.featured) : extractArray(payload.featured_news);
  const rawTrending = extractArray(payload.trending).length > 0 ? extractArray(payload.trending) : extractArray(payload.trending_news);
  const rawPopular = extractArray(payload.popular).length > 0 ? extractArray(payload.popular) : extractArray(payload.popular_news);
  const rawVideos = extractArray(payload.videos).length > 0 ? extractArray(payload.videos) : extractArray(payload.video_news);
  const rawPhotos = extractArray(payload.photos).length > 0 ? extractArray(payload.photos) : extractArray(payload.photo_gallery);
  const rawEditorsPick = extractArray(payload.recommended).length > 0 ? extractArray(payload.recommended) : extractArray(payload.editors_pick);
  const rawMostRead = extractArray(payload.most_read).length > 0 ? extractArray(payload.most_read) : extractArray(payload.most_viewed);
  // Apibyjunaid home returns these extra keys - extract them too
  const rawHeadlinePosts = extractArray(payload.headline_posts);
  const rawTopStories = extractArray(payload.top_stories);
  const rawLatest = extractArray(payload.latest); // paginated OR plain array

  // Collect all unique articles across all payload sections (used for the Latest News feed)
  const allRawArticles = [];
  const collectFrom = (val) => {
    const arr = extractArray(val);
    arr.forEach((item) => {
      if (item && typeof item === 'object' && item.id) {
        allRawArticles.push(item);
      }
    });
  };
  Object.values(payload).forEach((val) => {
    collectFrom(val);
  });

  // 2. Data Deduplication & Section Prioritization
  // Ensure stories that appear in Hero/Breaking sections do not repeat in lower sections.
  const seenIds = new Set();

  const processSection = (rawList, defaultCat, defaultColor) => {
    const result = [];
    if (!rawList || !Array.isArray(rawList)) return result;

    rawList.forEach((item) => {
      const sanitized = sanitizeArticle(item, defaultCat, defaultColor);
      if (sanitized && sanitized.id && !seenIds.has(sanitized.id)) {
        seenIds.add(sanitized.id);
        result.push(sanitized);
      }
    });
    return result;
  };

  // Process each section strictly using live API data
  const slider = processSection(rawSlider, "Top Stories", "#e11d48");
  const breaking = processSection(rawBreaking, "Breaking News", "#f43f5e");
  const featured = processSection(rawFeatured, "Featured", "#9333ea");
  const trending = processSection(rawTrending, "Trending", "#d97706");
  const editorsPick = processSection(rawEditorsPick, "Editors Pick", "#2563eb");
  const popular = processSection(rawPopular, "Popular", "#0d9488");
  const mostRead = processSection(rawMostRead, "Most Read", "#ec4899");

  // Latest News feed: first try dedicated `latest` key (handles paginated too),
  // then fall back to headline_posts/top_stories, then remaining from allRawArticles
  const latest = [];
  // Priority 1: rawLatest (already extracted from paginated or plain)
  rawLatest.forEach((item) => {
    const sanitized = sanitizeArticle(item, "Latest", "#4f46e5");
    if (sanitized && sanitized.id && !seenIds.has(sanitized.id)) {
      seenIds.add(sanitized.id);
      latest.push(sanitized);
    }
  });
  // Priority 2: headline_posts from Apibyjunaid
  [...rawHeadlinePosts, ...rawTopStories].forEach((item) => {
    const sanitized = sanitizeArticle(item, "Latest", "#4f46e5");
    if (sanitized && sanitized.id && !seenIds.has(sanitized.id)) {
      seenIds.add(sanitized.id);
      latest.push(sanitized);
    }
  });
  // Priority 3: any remaining articles from other sections not yet seen
  allRawArticles.forEach((item) => {
    const sanitized = sanitizeArticle(item, "Latest", "#4f46e5");
    if (sanitized && sanitized.id && !seenIds.has(sanitized.id)) {
      seenIds.add(sanitized.id);
      latest.push(sanitized);
    }
  });

  // 3. Category-wise Grouping
  const allProcessed = [...slider, ...breaking, ...featured, ...trending, ...latest, ...popular, ...editorsPick, ...mostRead];
  const categoryMap = {};
  allProcessed.forEach((art) => {
    const catName = art.category?.name || "General";
    if (!categoryMap[catName]) categoryMap[catName] = [];
    categoryMap[catName].push(art);
  });

  const categoryNews = Object.entries(categoryMap).map(([name, articles]) => ({
    categoryName: name,
    articles: articles.slice(0, 4), // Top 4 articles per category
  }));

  // Sanitize Ads
  // Convert API ad payload to the format expected by our UI
  let processedAds = [];
  if (Array.isArray(adsPayload) && adsPayload.length > 0) {
    processedAds = adsPayload.map(ad => ({
      id: ad.id || `ad-${Math.random()}`,
      title: ad.ad_title || 'Advertisement',
      image: ad.ad_banner || ad.image || ad.ad_image || 'https://pravahnews.com/public/uploads/logo/1352/WhatsApp-Image-2025-12-18-at-4.38.02-PM-removebg-preview.png', // fallback
      link: ad.ad_url || ad.link || '#',
      description: ad.ad_description || 'Sponsored Content'
    }));
  }

  // Return clean, organized homepage payload
  return {
    data: {
      status: "success",
      data: {
        slider,
        breaking,
        latest,
        featured,
        trending,
        categoryNews,
        popular,
        videos: rawVideos.length > 0 ? rawVideos : [],
        photos: rawPhotos.length > 0 ? rawPhotos : [],
        editorsPick,
        mostRead,
        allArticles: allProcessed,
        ads: processedAds.length > 0 ? processedAds : 
             (Array.isArray(payload.ads) && payload.ads.length > 0) ? payload.ads : 
             (Array.isArray(payload.advertisements) && payload.advertisements.length > 0) ? payload.advertisements : 
             (Array.isArray(payload.ad_banners) && payload.ad_banners.length > 0) ? payload.ad_banners : 
             [],
      },
    },
  };
};

/**
 * Gets all live TV channels (from localStorage or default initial dataset).
 */
export const getLiveChannels = () => {
  try {
    const saved = localStorage.getItem(CHANNELS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error loading saved channels:", e);
  }
  return INITIAL_LIVE_CHANNELS;
};

/**
 * Adds a new custom live channel and saves it to localStorage.
 */
export const addLiveChannel = (newChannel) => {
  const current = getLiveChannels();
  const channelWithId = {
    ...newChannel,
    id: `ch-custom-${Date.now()}`,
    viewers: newChannel.viewers || '10K',
    featured: false,
  };
  const updated = [channelWithId, ...current];
  try {
    localStorage.setItem(CHANNELS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Error saving channel:", e);
  }
  return updated;
};