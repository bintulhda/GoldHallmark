import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../styles/navbar.css'

/**
 * Navigation Bar Component
 * Sticky header with links to all pages and auth controls
 * Shows different menu based on authentication state
 */
function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
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
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={handleMenuClose}>
          🏆 Gold Guardian
        </Link>

        {/* Mobile Menu Toggle Button */}
        <div
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={handleMenuToggle}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Navigation Menu */}
        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/" onClick={handleMenuClose}>
              Home
            </Link>
          </li>

          {isAuthenticated && (
            <>
              <li>
                <Link to="/calculator" onClick={handleMenuClose}>
                  Calculator
                </Link>
              </li>
              <li>
                <Link to="/verify-huid" onClick={handleMenuClose}>
                  Verify HUID
                </Link>
              </li>
              <li>
                <Link to="/learn" onClick={handleMenuClose}>
                  Learn
                </Link>
              </li>
              <li>
                <Link to="/complaint" onClick={handleMenuClose}>
                  Complaint
                </Link>
              </li>
            </>
          )}

          <li className="navbar-divider"></li>

          {isAuthenticated ? (
            <>
              <li className="navbar-user">
                <span className="user-email">{user?.displayName || user?.email}</span>
              </li>
              <li>
                <Link to="/profile" className="navbar-profile" onClick={handleMenuClose}>
                  👤 Profile
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="navbar-logout">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="navbar-auth" onClick={handleMenuClose}>
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="navbar-auth navbar-auth-primary" onClick={handleMenuClose}>
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
