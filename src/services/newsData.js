/**
 * ============================================================================
 * PRAVAH DAILYHUNT - DYNAMIC DATA CONFIGURATION
 * ============================================================================
 * All static/demo news, static ads, and static channels have been removed
 * as per user requirements. All content must now be dynamically loaded
 * from the live Pravah News API (https://pravahnews.com/api/home) or via
 * user actions (e.g. adding custom TV channels to localStorage).
 */

export const INITIAL_LIVE_CHANNELS = [
  {
    id: 'ch-1',
    name: 'Pravah News Live',
    category: 'News',
    viewers: '25K',
    description: '24/7 Live Coverage of National and International News.',
    logo: 'https://pravahnews.com/public/uploads/logo/1352/WhatsApp-Image-2025-12-18-at-4.38.02-PM-removebg-preview.png',
    embedUrl: 'https://www.youtube.com/embed/live_stream?channel=UC4_o6_oF0xX1k6F8T1X_m1g&autoplay=1&mute=1'
  }
];

export const ENGLISH_NEWS_ARTICLES = [];
