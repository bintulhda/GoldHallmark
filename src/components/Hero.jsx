import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Hero.css'

/**
 * Hero Section Component - Cinematic Premium Design
 * High-end fintech aesthetic with glassmorphism data card
 */
export default function Hero() {
  const navigate = useNavigate()
  const [goldPrice, setGoldPrice] = useState('₹7,450')
  const [isCardHovered, setIsCardHovered] = useState(false)

  useEffect(() => {
    // Simulate live gold price updates
    const timer = setInterval(() => {
      const basePrice = 7450
      const variation = Math.floor(Math.random() * 100) - 50
      setGoldPrice(`₹${(basePrice + variation).toLocaleString('en-IN')}`)
    }, 5000)
    
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="hero-section">
      {/* Cinematic Background Layers */}
      <div className="hero-background-gradient"></div>
      <div className="hero-radial-glow"></div>
      <div className="hero-particles"></div>

      <div className="hero-container">
        {/* Left Content Section - 60% */}
        <div className="hero-content">
          {/* Dramatic Headline */}
          <div className="hero-headline-group">
            <h1 className="hero-title">
              <span className="title-line">Verify Gold</span>
              <span className="title-line">with</span>
              <span className="title-line">
                <span className="certainty-text">CERTAINTY</span>
              </span>
            </h1>
          </div>

          <p className="hero-subtitle">
            India's first AI-powered platform for BIS hallmark verification and
            real-time gold pricing. Trade confidently, invest wisely.
          </p>

          <div className="hero-buttons">
            <button
              className="hero-button hero-button-primary"
              onClick={() => navigate('/signup')}
            >
              <span className="button-text">Start Verifying</span>
              <span className="button-icon">→</span>
              <span className="button-glow"></span>
            </button>

            <button
              className="hero-button hero-button-secondary"
              onClick={() => navigate('/learn')}
            >
              Learn More
            </button>
          </div>

          {/* Feature List */}
          <div className="hero-features">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>BIS-Certified HUID Verification</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Live Gold Price Updates</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Government-Grade Security</span>
            </div>
          </div>
        </div>

        {/* Right Side - Premium Glassmorphism Data Card */}
        <div 
          className="hero-data-card-container"
          onMouseEnter={() => setIsCardHovered(true)}
          onMouseLeave={() => setIsCardHovered(false)}
        >
          <div className="hero-data-card">
            {/* Card Header */}
            <div className="card-header">
              <div className="card-title">
                <span className="card-label">Live Gold Price</span>
              </div>
              <div className="card-badge">24K</div>
            </div>

            {/* Gold Price Display */}
            <div className="price-display">
              <div className="price-value">{goldPrice}</div>
              <div className="price-change">
                <span className="change-badge">+₹15 (0.2%)</span>
                <span className="time-label">Today</span>
              </div>
            </div>

            {/* Divider */}
            <div className="card-divider"></div>

            {/* Verification Stats */}
            <div className="verification-stats">
              <div className="stat-item">
                <div className="stat-label">Verified</div>
                <div className="stat-value">98.7%</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Certifications</div>
                <div className="stat-value">BIS Grade</div>
              </div>
            </div>

            {/* Card Footer with Action */}
            <div className="card-footer">
              <button 
                className="card-action-btn"
                onClick={() => navigate('/calculator')}
              >
                Check Gold Value
              </button>
            </div>

            {/* Glowing border effect */}
            <div className="card-glow-border"></div>
          </div>

          {/* Decorative floating element */}
          <div className={`card-decoration ${isCardHovered ? 'active' : ''}`}></div>
        </div>
      </div>
    </section>
  )
}
