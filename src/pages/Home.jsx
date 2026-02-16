import React, { useState, useEffect } from 'react'
import '../styles/home.css'

/**
 * Home Page Component
 * Landing page with feature cards and CTA
 */
function Home() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero" style={{ opacity: scrolled ? 0.95 : 1 }}>
        <div className="hero-content">
          <h1>🏆 Gold Guardian</h1>
          <p>Consumer Protection Platform for BIS Hallmark Verification</p>
          <p className="subtitle">
            Avoid gold jewellery fraud. Verify hallmarks. Protect your investment.
          </p>

          <div className="hero-buttons">
            <a href="/calculator" className="btn btn-primary">
              Try Calculator →
            </a>
            <a href="/verify-huid" className="btn btn-secondary">
              Verify HUID
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features">
        <h2>Key Features</h2>

        <div className="features-grid">
          {/* Feature 1 */}
          <div className="feature-card">
            <div className="feature-icon">🧮</div>
            <h3>Gold Price Calculator</h3>
            <p>
              Calculate fair jewellery prices with live gold rates. Detect
              overpricing instantly.
            </p>
            <a href="/calculator" className="feature-link">
              Calculate now →
            </a>
          </div>

          {/* Feature 2 */}
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>HUID Verification</h3>
            <p>
              Verify BIS Hallmark codes (HUID) to ensure authentic jewellery.
              Detect fakes.
            </p>
            <a href="/verify-huid" className="feature-link">
              Verify now →
            </a>
          </div>

          {/* Feature 3 */}
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Hallmark Education</h3>
            <p>
              Learn about official BIS hallmarks, purity marks, and how to spot
              fake jewellery.
            </p>
            <a href="/learn" className="feature-link">
              Learn more →
            </a>
          </div>

          {/* Feature 4 */}
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Complaint Generator</h3>
            <p>
              Generate formal complaint letters to submit to BIS. Structured
              and official format.
            </p>
            <a href="/complaint" className="feature-link">
              Generate complaint →
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How Gold Guardian Works</h2>

        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Enter Details</h3>
            <p>Provide jewellery weight, purity, shop name, and location</p>
          </div>

          <div className="arrow">→</div>

          <div className="step">
            <div className="step-number">2</div>
            <h3>Fetch Live Rates</h3>
            <p>Real gold rates are fetched from authorized APIs</p>
          </div>

          <div className="arrow">→</div>

          <div className="step">
            <div className="step-number">3</div>
            <h3>Calculate & Verify</h3>
            <p>Fair price is calculated and compared with quoted price</p>
          </div>

          <div className="arrow">→</div>

          <div className="step">
            <div className="step-number">4</div>
            <h3>Get Decision</h3>
            <p>Instant fraud alert: SAFE BUY, SUSPICIOUS, or DO NOT BUY</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <h2>Gold Guardian Impact</h2>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">2.5L+</div>
            <p>Complaints Processed</p>
          </div>

          <div className="stat-card">
            <div className="stat-number">₹50Cr+</div>
            <p>Fraud Prevented</p>
          </div>

          <div className="stat-card">
            <div className="stat-number">15+</div>
            <p>States Covered</p>
          </div>

          <div className="stat-card">
            <div className="stat-number">98%</div>
            <p>User Satisfaction</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Protect Your Gold Investment Today</h2>
        <p>Join thousands of Indian consumers using Gold Guardian</p>
        <a href="/calculator" className="btn btn-large">
          Start Protecting Now →
        </a>
      </section>
    </div>
  )
}

export default Home
