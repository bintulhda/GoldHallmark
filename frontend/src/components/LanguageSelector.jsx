import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/languageSelector.css';

/**
 * Language Selector Component
 * Displays language buttons for switching between supported languages
 */
export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  // Update state when language changes outside of component
  useEffect(() => {
    setCurrentLang(i18n.language);
  }, [i18n.language]);

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', icon: '🌐' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', icon: '🇮🇳' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', icon: '🌴' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', icon: '🏛️' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', icon: '🌾' },
  ];

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    setCurrentLang(langCode);
    
    // Store in localStorage
    localStorage.setItem('language', langCode);
    
    // Optionally store in user profile if authenticated
    if (window.user) {
      // Update user preference in backend
    }
  };

  return (
    <div className="language-selector">
      <div className="language-selector-wrapper">
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={`language-btn ${currentLang === lang.code ? 'active' : ''}`}
            onClick={() => handleLanguageChange(lang.code)}
            title={lang.name}
            aria-label={`Switch to ${lang.name}`}
          >
            <span className="lang-icon">{lang.icon}</span>
            <span className="lang-name">{lang.nativeName}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
