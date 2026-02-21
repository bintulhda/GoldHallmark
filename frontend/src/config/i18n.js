import i18n from 'i18next';

// Import translation files from locales directory
import enCommon from '../locales/en/common.json';
import hiCommon from '../locales/hi/common.json';
import mrCommon from '../locales/mr/common.json';
import paCommon from '../locales/pa/common.json';
import taCommon from '../locales/ta/common.json';

/**
 * Configure i18next for multi-language support
 */
i18n
  .init({
    resources: {
      en: { common: enCommon },
      hi: { common: hiCommon },
      ta: { common: taCommon },
      mr: { common: mrCommon },
      pa: { common: paCommon },
    },
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common'],
    
    // Get saved language from localStorage or browser settings
    lng: localStorage.getItem('language') || 'en',
    
    // Enable debug mode in development
    debug: false,
    
    // Interpolation settings
    interpolation: {
      escapeValue: false, // React already handles XSS
    },

    // React-specific settings
    react: {
      useSuspense: false,
    },
  });

// Save language preference to localStorage when it changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n;
