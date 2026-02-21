/**
 * Custom Hook: useTranslations
 * Simplifies translation usage throughout the application
 * 
 * Usage:
 * const t = useTranslations()
 * return <h1>{t('hero.title')}</h1>
 */

import { useTranslation } from 'react-i18next';

export function useAppTranslations() {
  const { t, i18n } = useTranslation('common');

  return {
    t,
    language: i18n.language,
    changeLanguage: i18n.changeLanguage,
    supportedLanguages: ['en', 'hi', 'ta', 'mr', 'pa'],
  };
}

/**
 * Utility: Get language name in its native script
 */
export const getLanguageName = (langCode) => {
  const languages = {
    en: { name: 'English', native: 'English' },
    hi: { name: 'Hindi', native: 'हिंदी' },
    ta: { name: 'Tamil', native: 'தமிழ்' },
    mr: { name: 'Marathi', native: 'मराठी' },
    pa: { name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  };
  return languages[langCode] || { name: 'English', native: 'English' };
};

/**
 * Utility: Get language direction (LTR/RTL)
 */
export const getLanguageDirection = (langCode) => {
  const rtlLanguages = ['ar', 'he', 'ur']; // For future expansion
  return rtlLanguages.includes(langCode) ? 'rtl' : 'ltr';
};

/**
 * Utility: Format date according to language/locale
 */
export const formatDateByLanguage = (date, langCode) => {
  const locales = {
    en: 'en-US',
    hi: 'hi-IN',
    ta: 'ta-IN',
    mr: 'mr-IN',
    pa: 'pa-IN',
  };

  return new Date(date).toLocaleDateString(locales[langCode] || 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Utility: Format currency according to language/locale
 */
export const formatCurrencyByLanguage = (amount, langCode) => {
  const locales = {
    en: 'en-IN',
    hi: 'hi-IN',
    ta: 'ta-IN',
    mr: 'mr-IN',
    pa: 'pa-IN',
  };

  return new Intl.NumberFormat(locales[langCode] || 'en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

/**
 * Utility: Get available languages list
 */
export const getAvailableLanguages = () => [
  { code: 'en', name: 'English', icon: '🌐' },
  { code: 'hi', name: 'हिंदی', icon: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', icon: '🌴' },
  { code: 'mr', name: 'मराठी', icon: '🏛️' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', icon: '🌾' },
];
