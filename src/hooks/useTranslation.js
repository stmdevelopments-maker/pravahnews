// src/hooks/useTranslation.js
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { translateNewsBatch, translateFullArticle } from '../services/translationService';

// Static UI dictionary
const uiTranslations = {
  hi: {
    home: 'होम',
    latest: 'ताज़ा खबरें',
    trending: 'ट्रेंडिंग',
    readMore: 'और पढ़ें',
    search: 'खोजें',
    searchPlaceholder: 'समाचार खोजें...',
    login: 'लॉगिन',
    logout: 'लॉगआउट',
    profile: 'प्रोफ़ाइल',
    categories: 'श्रेणियां',
    topNews: 'प्रमुख ख़बरें',
    breakingNews: 'प्रमुख-समाचार',
    national: 'राष्ट्रीय',
    entertainment: 'मनोरंजन',
    international: 'अंतरराष्ट्रीय',
    politics: 'राजनीति',
    business: 'व्यापार',
    lifestyle: 'जीवनशैली',
    sports: 'खेल',
    health: 'स्वास्थ्य',
    technology: 'तकनीक',
    crime: 'अपराध',
    darkMode: 'डार्क मोड',
    lightMode: 'लाइट मोड',
    translating: 'अनुवाद हो रहा है...',
    translationUnavailable: 'अनुवाद उपलब्ध नहीं है',
    retry: 'पुनः प्रयास करें',
    liveTv: 'लाइव टीवी',
    addChannel: 'चैनल जोड़ें',
    allCategories: 'सभी श्रेणियां',
    cancel: 'रद्द करें',
    submit: 'जमा करें',
    // Footer
    footerBio: 'भारत और दुनिया भर में रीयल-टाइम पत्रकारिता, ब्रेकिंग न्यूज़ और गहराई से पड़ताल की गई रिपोर्ट्स। सटीकता और ईमानदारी के साथ अपडेट रहें।',
    quickLinks: 'त्वरित लिंक',
    aboutUs: 'हमारे बारे में',
    contactUs: 'संपर्क करें',
    editorialPolicy: 'संपादकीय नीति',
    privacyPolicy: 'गोपनीयता नीति',
    termsConditions: 'नियम और शर्तें',
    stayInformed: 'अपडेट रहें',
    newsletterText: 'सीधे अपने इनबॉक्स में ताज़ा हेडलाइंस पाने के लिए हमारे न्यूज़लेटर को सब्सक्राइब करें।',
    enterEmail: 'अपना ईमेल पता दर्ज करें...',
    subscribe: 'सब्सक्राइब करें',
    subscribeSuccess: '✓ धन्यवाद! आपने सफलतापूर्वक सब्सक्राइब कर लिया है।',
    copyright: '© 2026 प्रवाह न्यूज़ पोर्टल। सर्वाधिकार सुरक्षित।',
    techCredit: 'React और Vite के साथ निर्मित • गति और उत्कृष्टता के लिए डिज़ाइन किया गया',
    // Auth
    loginTitle: 'प्रवाह न्यूज़ में लॉगिन करें',
    registerTitle: 'अकाउंट बनाएं',
    forgotTitle: 'पासवर्ड रीसेट करें',
    emailOrUsername: 'ईमेल या यूज़रनेम',
    password: 'पासवर्ड',
    forgotPassword: 'पासवर्ड भूल गए?',
    signInBtn: 'लॉगिन करें',
    noAccount: 'अकाउंट नहीं है?',
    registerNow: 'अभी रजिस्टर करें',
    firstName: 'पहला नाम',
    lastName: 'अंतिम नाम',
    username: 'यूज़रनेम',
    emailAddress: 'ईमेल पता',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    createAccountBtn: 'अकाउंट बनाएं',
    haveAccount: 'पहले से अकाउंट है?',
    loginHere: 'यहाँ लॉगिन करें',
    sendResetLink: 'रीसेट लिंक भेजें',
    backToLogin: 'लॉगिन पर वापस जाएं',
    // Profile
    accessDenied: 'पहुंच अस्वीकृत',
    loginToView: 'अपना प्रोफ़ाइल देखने के लिए कृपया लॉग इन करें।',
    goToHome: 'होम पर जाएं',
    myProfile: 'मेरा प्रोफ़ाइल',
    newsReader: 'न्यूज़ रीडर',
    editorialTeam: 'संपादकीय टीम',
    registeredReader: 'पंजीकृत पाठक',
    accountSettings: 'खाता सेटिंग्स',
    savedArticles: 'सहेजे गए लेख',
    notificationPrefs: 'अधिसूचना प्राथमिकताएं',
    logOutBtn: 'लॉग आउट',
    // Chatbot
    botGreeting: '🙏 नमस्ते! मैं प्रवाह न्यूज़ का AI Assistant हूँ।\n\nमैं आपको न्यूज़ टॉपिक, कैटेगरी, और आर्टिकल खोजने में मदद कर सकता हूँ। कुछ पूछना हो तो बताएं! 😊',
    botApiKeyWarning: '⚠️ Gemini API key कॉन्फ़िगर नहीं है। कृपया `.env` फ़ाइल में `VITE_GEMINI_API_KEY` जोड़ें।\n\nअभी तक: मैं सिर्फ नमस्कार कर सकता हूँ! 😊',
    botError: '❌ त्रुटि:',
    botFallback: 'माफ़ करें, कोई जवाब नहीं मिला।',
    botName: 'प्रवाह AI असिस्टेंट',
    botTyping: 'टाइप कर रहा है...',
    botOnline: 'ऑनलाइन',
    botAskPlaceholder: 'कुछ पूछें... (भेजने के लिए Enter दबाएं)',
    quick1: 'ताज़ा ख़बरें क्या हैं?',
    quick2: 'ब्रेकिंग न्यूज़ दिखाओ',
    quick3: 'कैटगरीज़ बताओ'
  },
  en: {
    home: 'Home',
    latest: 'Latest News',
    trending: 'Trending',
    readMore: 'Read More',
    search: 'Search',
    searchPlaceholder: 'Search News...',
    login: 'Login',
    logout: 'Logout',
    profile: 'Profile',
    categories: 'Categories',
    topNews: 'Top News',
    breakingNews: 'Breaking News',
    national: 'National',
    entertainment: 'Entertainment',
    international: 'International',
    politics: 'Politics',
    business: 'Business',
    lifestyle: 'Lifestyle',
    sports: 'Sports',
    health: 'Health',
    technology: 'Technology',
    crime: 'Crime',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    translating: 'Translating...',
    translationUnavailable: 'Translation Unavailable',
    retry: 'Retry',
    liveTv: 'Live TV',
    addChannel: 'Add Channel',
    allCategories: 'All Categories',
    cancel: 'Cancel',
    submit: 'Submit',
    // Footer
    footerBio: 'Delivering real-time journalism, breaking news, and in-depth investigative reports across India and around the globe. Stay informed with accuracy and integrity.',
    quickLinks: 'Quick Links',
    aboutUs: 'About Us',
    contactUs: 'Contact Us',
    editorialPolicy: 'Editorial Policy',
    privacyPolicy: 'Privacy Policy',
    termsConditions: 'Terms & Conditions',
    stayInformed: 'Stay Informed',
    newsletterText: 'Subscribe to our morning newsletter for curated headlines delivered straight to your inbox.',
    enterEmail: 'Enter your email address...',
    subscribe: 'Subscribe',
    subscribeSuccess: "✓ Thank you! You're now subscribed.",
    copyright: '© 2026 Pravah News Portal. All rights reserved.',
    techCredit: 'Built with React & Vite • Designed for Speed & Excellence',
    // Auth
    loginTitle: 'Login to Pravah News',
    registerTitle: 'Create Account',
    forgotTitle: 'Reset Password',
    emailOrUsername: 'Email or Username',
    password: 'Password',
    forgotPassword: 'Forgot Password?',
    signInBtn: 'Sign In',
    noAccount: "Don't have an account?",
    registerNow: 'Register now',
    firstName: 'First Name',
    lastName: 'Last Name',
    username: 'Username',
    emailAddress: 'Email Address',
    confirmPassword: 'Confirm Password',
    createAccountBtn: 'Create Account',
    haveAccount: 'Already have an account?',
    loginHere: 'Login here',
    sendResetLink: 'Send Reset Link',
    backToLogin: 'Back to Login',
    // Profile
    accessDenied: 'Access Denied',
    loginToView: 'Please log in to view your profile.',
    goToHome: 'Go to Home',
    myProfile: 'My Profile',
    newsReader: 'News Reader',
    editorialTeam: 'Editorial Team',
    registeredReader: 'Registered Reader',
    accountSettings: 'Account Settings',
    savedArticles: 'Saved Articles',
    notificationPrefs: 'Notification Preferences',
    logOutBtn: 'Log Out',
    // Chatbot
    botGreeting: '🙏 Hello! I am Pravah News AI Assistant.\n\nI can help you with news topics, categories, and articles. Ask me anything! 😊',
    botApiKeyWarning: '⚠️ Gemini API key is not configured. Please add `VITE_GEMINI_API_KEY` to your `.env` file.\n\nFor now: I can only greet you! 😊',
    botError: '❌ Error:',
    botFallback: 'Sorry, could not find an answer.',
    botName: 'Pravah AI Assistant',
    botTyping: 'Typing...',
    botOnline: 'Online',
    botAskPlaceholder: 'Ask something... (Enter to send)',
    quick1: 'What is the latest news?',
    quick2: 'Show breaking news',
    quick3: 'Tell me categories'
  }
};

export const useTranslation = () => {
  const { language, setLanguage, isTranslating, setIsTranslating } = useContext(LanguageContext);

  // Static UI translation function
  const t = (key) => {
    return uiTranslations[language]?.[key] || uiTranslations.hi[key] || key;
  };

  // Wrapper around batch translator
  const translateDynamicNews = async (newsList) => {
    if (language === 'hi') return newsList; // No translation needed

    try {
      const translated = await translateNewsBatch(newsList, language);
      return translated;
    } catch (err) {
      // Silence error
      return newsList; // fallback to original
    }
  };

  return {
    language,
    setLanguage,
    t,
    isTranslating,
    setIsTranslating,
    translateDynamicNews,
    translateFullArticle
  };
};
