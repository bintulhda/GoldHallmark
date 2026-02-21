import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import LanguagePanel from './LanguagePanel'
import '../styles/navbar.css'

/**
 * Navigation Bar Component
 * Sticky header with links to all pages and auth controls
 * Shows different menu based on authentication state
 */
function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLanguagePanelOpen, setIsLanguagePanelOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const { t } = useTranslation('common')
  const navigate = useNavigate()

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleMenuClose = () => {
    setIsMenuOpen(false)
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
      handleMenuClose()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left: Logo */}
        <Link to="/" className="navbar-logo" onClick={handleMenuClose}>
          🛡️ Gold Guardian
        </Link>

        {/* Center: Navigation Menu */}
        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/" onClick={handleMenuClose}>
              {t('navbar.home')}
            </Link>
          </li>

          {isAuthenticated && (
            <>
              <li>
                <Link to="/calculator" onClick={handleMenuClose}>
                  {t('navbar.calculator')}
                </Link>
              </li>
              <li>
                <Link to="/verify-huid" onClick={handleMenuClose}>
                  {t('navbar.verifyHuid')}
                </Link>
              </li>
              <li>
                <Link to="/learn" onClick={handleMenuClose}>
                  {t('navbar.learn')}
                </Link>
              </li>
              <li>
                <Link to="/complaint" onClick={handleMenuClose}>
                  {t('navbar.complaint')}
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Right: Language Globe Icon + Auth Controls */}
        <div className="navbar-right">
          {/* Language Selector Globe Icon */}
          <button
            className="navbar-language-btn"
            onClick={() => setIsLanguagePanelOpen(true)}
            title="Change language"
            aria-label="Open language selector"
          >
            🌐
          </button>

          {/* Mobile Menu Toggle */}
          <div
            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={handleMenuToggle}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          {/* Auth & Profile Section */}
          <div className="navbar-auth-section">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="navbar-profile-link" onClick={handleMenuClose}>
                  👤
                  <span>{user?.displayName || user?.email?.split('@')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="navbar-logout-btn">
                  {t('navbar.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar-auth-link" onClick={handleMenuClose}>
                  {t('navbar.login')}
                </Link>
                <Link to="/signup" className="navbar-auth-link navbar-auth-primary" onClick={handleMenuClose}>
                  {t('navbar.signup')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Language Panel Slide-in */}
      <LanguagePanel
        isOpen={isLanguagePanelOpen}
        onClose={() => setIsLanguagePanelOpen(false)}
      />
    </nav>
  )
}

export default Navbar
