import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/navbar.css'

/**
 * Navigation Bar Component
 * Sticky header with links to all pages
 */
function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleMenuClose = () => {
    setIsMenuOpen(false)
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
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
