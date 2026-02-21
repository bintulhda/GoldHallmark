import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '../styles/languagePanel.css'

const LANGUAGES = [
  { code: 'en', name: 'English', emoji: '�🇧', nativeName: 'English' },
  { code: 'hi', name: 'हिंदी', emoji: '🇮🇳', nativeName: 'हिंदी' },
  { code: 'ta', name: 'தமிழ்', emoji: '🌴', nativeName: 'தமிழ்' },
  { code: 'mr', name: 'मराठी', emoji: '🏛️', nativeName: 'मराठी' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', emoji: '🌾', nativeName: 'ਪੰਜਾਬੀ' },
]

function LanguagePanel({ isOpen, onClose }) {
  const { i18n } = useTranslation('common')

  // Close panel when escape key is pressed
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Close when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode)
    localStorage.setItem('language', langCode)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="language-panel-backdrop" 
          onClick={handleBackdropClick}
        />
      )}

      {/* Slide-in Panel */}
      <div className={`language-panel ${isOpen ? 'open' : ''}`}>
        {/* Close Button */}
        <button
          className="language-panel-close"
          onClick={onClose}
          aria-label="Close language panel"
        >
          ✕
        </button>

        {/* Panel Header */}
        <div className="language-panel-header">
          <h2>Select Language</h2>
          <p className="language-panel-subtitle">Choose your preferred language</p>
        </div>

        {/* Language Options */}
        <div className="language-options">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              className={`language-option ${
                i18n.language === lang.code ? 'active' : ''
              }`}
              onClick={() => handleLanguageChange(lang.code)}
              aria-label={`Switch to ${lang.name}`}
            >
              <span className="language-emoji">{lang.emoji}</span>
              <div className="language-names">
                <span className="language-name">{lang.nativeName}</span>
                <span className="language-english">{lang.name}</span>
              </div>
              {i18n.language === lang.code && (
                <span className="language-checkmark">✓</span>
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="language-panel-footer">
          <p className="language-panel-hint">
            Your preference is saved automatically
          </p>
        </div>
      </div>
    </>
  )
}

export default LanguagePanel
