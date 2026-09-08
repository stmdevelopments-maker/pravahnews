# newsSTM — Pravah News Portal (प्रवाह न्यूज़)

A modern, dynamic, and responsive live news web application built using **React + Vite**. Inspired by the Dailyhunt design system, this platform delivers real-time news across multiple categories directly from the [Pravah News API](https://pravahnews.com/api/home).

---

## 🌟 Key Features

1. **Live API Integration**:
   - Strictly fetches real-time news data from `https://pravahnews.com/api/home`.
   - Zero static or demo fallback articles ensure pure dynamic content rendering.
   - Automatic deduplication so top headline stories do not repeat across lower sections.

2. **Dailyhunt-Inspired Mobile-First UI/UX**:
   - Modern glassmorphism header, smooth category sliders, and interactive cards.
   - **Hero Slider / Top Headlines** at the forefront.
   - **Breaking News Ticker** with live alert badge.
   - **Featured, Trending, Popular & Editors' Picks** dedicated sections.
   - **Category-Wise Grouping** (`National`, `Sports`, `Politics`, `Entertainment`, `Business`, `Tech & AI`, `Lifestyle`, etc.).

3. **24/7 Live TV & Video Hub**:
   - Watch continuous live stream broadcasts (WION, India Today, NDTV, NASA, DD India).
   - **Add Live Channel Option**: Users can add custom YouTube/stream embed URLs stored directly in local storage (`pravah_live_channels_v1`).

4. **Interactive News Action Bar**:
   - **WhatsApp Share**: Instantly share articles with formatted headlines and URLs via WhatsApp.
   - **Copy / System Share**: Native web share API integration and instant clipboard copying.
   - **Report Article Modal**: Interactive reporting tool with category selection, description, and toast feedback.

5. **Dynamic Ad Injection**:
   - Smart ad engine injects sponsored brand cards and civic campaign cards every 4 news articles.

6. **Official Pravah News Branding**:
   - High-resolution emblem header logo and footer logo banner (`प्रवाह न्यूज़ — हर पल, हर खबर`).
   - Custom title (`Pravah News - हर पल, हर खबर | Live & Breaking News Portal`) and favicon.

---

## 🛠️ Technology Stack

- **Core**: React 18+ (Vite)
- **Styling**: Vanilla CSS with custom CSS variables (Dark Mode ready, responsive tokens)
- **HTTP Client**: Axios (with 10-second timeout handling and graceful state management)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gautamsingh870070-byte/newsSTM.git
   cd newsSTM
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```
my-newsapp/
├── index.html                  # Main HTML entry point with Pravah News branding & metadata
├── src/
│   ├── components/             # Reusable UI & Modal components
│   │   ├── Header.jsx          # Glassmorphism Top Bar with official emblem logo
│   │   ├── Footer.jsx          # Comprehensive Footer with mission & scroll-to-top
│   │   ├── NewsCard.jsx        # Article card with WhatsApp, Share, & Report actions
│   │   ├── AdCard.jsx          # Sponsored & Civic ad card component
│   │   ├── BottomNav.jsx       # Mobile bottom navigation bar
│   │   ├── ReportModal.jsx     # Interactive Report News modal
│   │   ├── ShareModal.jsx      # Social share modal
│   │   └── AddChannelModal.jsx # Add custom Live TV channel modal
│   ├── components/sections/    # Homepage structured sections
│   │   ├── HeroSection.jsx     # Top story big banner
│   │   ├── BreakingSection.jsx # Breaking ticker & flash news
│   │   ├── FeaturedSection.jsx # Featured spotlight grid
│   │   ├── TrendingSection.jsx # Trending stories rank list
│   │   ├── LatestSection.jsx   # All latest feed with dynamic ad injection
│   │   ├── CategorySection.jsx # Category-wise grouped articles
│   │   ├── PopularSection.jsx  # Most read & popular feed
│   │   ├── EditorsPickSection.jsx # Recommended stories
│   │   └── VideoSection.jsx    # 24/7 Live TV video hub player
│   ├── pages/
│   │   └── Home.jsx            # Master homepage controller handling loading/error states
│   ├── services/
│   │   ├── news.service.js     # Live API fetching & data sanitization layer
│   │   └── newsData.js         # Dynamic ad banners & initial 24/7 live TV channels
│   ├── styles/                 # Modular CSS stylesheets
│   │   ├── Sections.css        # Section layouts & Dailyhunt mobile-first styling
│   │   ├── Modals.css          # Modal animations & backdrops
│   │   └── AdCard.css          # Ad banner gradient cards
│   ├── App.jsx                 # Global state provider & modals manager
│   └── main.jsx                # React DOM render bootstrap
└── package.json                # Project dependencies & build scripts
```

---

## 📌 API Reference
- **Home Endpoint**: `https://pravahnews.com/api/home`
- Returns arrays for `slider`, `breaking`, `featured`, `trending`, `popular`, `recommended`, and more.

---

## 📄 License
© 2026 Pravah News Portal. All rights reserved.
# newsSTM
