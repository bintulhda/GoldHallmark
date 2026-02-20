import React, { useState, useEffect } from 'react'
import '../styles/home.css'
import Hero from '../components/Hero'
import Toast from '../components/Toast'
import GoldCoinRain from '../components/GoldCoinRain'
import {
  verifyHuidViaApi,
  subscribeAlertsApi,
  unsubscribeAlertsApi,
} from '../utils/api'

/**
 * Home Page Component
 * Landing page with hero section and feature cards
 */
function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [quickHuid, setQuickHuid] = useState('')
  const [quickResult, setQuickResult] = useState(null)
  const [quickLoading, setQuickLoading] = useState(false)
  const [alertPhone, setAlertPhone] = useState('')
  const [alertsEnabled, setAlertsEnabled] = useState(false)
  const [toast, setToast] = useState({ type: 'info', message: '' })

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999'
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hi, I want to verify my gold with Gold Guardian.',
  )}`

  const handleQuickVerify = async (e) => {
    e.preventDefault()
    if (!quickHuid.trim()) return

    try {
      setQuickLoading(true)
      const result = await verifyHuidViaApi(quickHuid)
      setQuickResult(result)
      setToast({
        type: result.success ? 'success' : 'error',
        message: result.message,
      })
    } catch (error) {
      console.error(error)
      setToast({
        type: 'error',
        message: 'Unable to verify HUID right now. Please try again.',
      })
    } finally {
      setQuickLoading(false)
    }
  }

  const handleAlertToggle = async () => {
    if (!alertPhone.trim()) {
      setToast({
        type: 'error',
        message: 'Please enter your WhatsApp number with country code.',
      })
      return
    }

    try {
      if (!alertsEnabled) {
        const res = await subscribeAlertsApi(alertPhone)
        setAlertsEnabled(true)
        setToast({ type: 'success', message: res.message })
      } else {
        const res = await unsubscribeAlertsApi(alertPhone)
        setAlertsEnabled(false)
        setToast({ type: 'info', message: res.message })
      }
    } catch (error) {
      console.error(error)
      setToast({
        type: 'error',
        message: 'Could not update alert preferences. Please try again.',
      })
    }
  }

  return (
    <div className="home-page">
      {/* Floating Gold Coins Background */}
      <GoldCoinRain />

      {/* Premium 3D Hero Section with WebGL */}
      <Hero />

      {/* Phase 1: WhatsApp Bot */}
      <section className="whatsapp-section">
        <div className="whatsapp-doodle whatsapp-doodle-left" />
        <div className="whatsapp-doodle whatsapp-doodle-right" />

        <div className="whatsapp-grid">
          <div className="whatsapp-intro glass-card">
            <span className="badge">Phase 1</span>
            <h2>WhatsApp Bot – Verify Gold in Chat</h2>
            <p className="whatsapp-subtitle">
              No app. No login. Just send a message on WhatsApp to verify HUID,
              get live gold prices, and receive fraud alerts.
            </p>

            <ul className="whatsapp-benefits">
              <li>💬 Easy verification via WhatsApp chat</li>
              <li>⚡ Instant HUID checks using BIS-style data</li>
              <li>📈 Gold price alerts directly on your phone</li>
            </ul>

            <a href={whatsappLink} target="_blank" rel="noreferrer" className="btn btn-whatsapp">
              Verify on WhatsApp
            </a>

            <p className="whatsapp-helper">
              Send <code>HELP</code>, <code>PRICE</code>, <code>VERIFY AB1234</code> or{' '}
              <code>ALERT ON</code> to get started.
            </p>
          </div>

          <div className="whatsapp-actions glass-card">
            <h3>Try it from the website</h3>

            {/* Quick HUID verification */}
            <form className="quick-verify-form" onSubmit={handleQuickVerify}>
              <label htmlFor="quickHuid">Quick HUID Check</label>
              <div className="quick-verify-input-group">
                <input
                  id="quickHuid"
                  type="text"
                  maxLength="10"
                  placeholder="E.g., AB1234"
                  value={quickHuid}
                  onChange={(e) => setQuickHuid(e.target.value.toUpperCase())}
                />
                <button
                  type="submit"
                  className="btn btn-small"
                  disabled={quickLoading || !quickHuid}
                >
                  {quickLoading ? 'Checking…' : 'Verify'}
                </button>
              </div>
              {quickResult && (
                <div className={`quick-verify-result ${quickResult.success ? 'valid' : 'invalid'}`}>
                  <p>{quickResult.message}</p>
                  {quickResult.success && (
                    <ul>
                      <li>Purity: {quickResult.goldPurity}</li>
                      <li>Status: {quickResult.certificationStatus}</li>
                      <li>Jeweller: {quickResult.jewelerName}</li>
                      <li>Location: {quickResult.location}</li>
                    </ul>
                  )}
                </div>
              )}
            </form>

            {/* Alerts toggle */}
            <div className="alerts-card">
              <h4>Gold Price Alerts on WhatsApp</h4>
              <p className="alerts-caption">
                Get notified when gold prices move – perfect for planning your purchase.
              </p>
              <div className="alerts-controls">
                <input
                  type="tel"
                  placeholder="WhatsApp number with country code"
                  value={alertPhone}
                  onChange={(e) => setAlertPhone(e.target.value)}
                />
                <button
                  type="button"
                  className={`toggle-switch ${alertsEnabled ? 'on' : 'off'}`}
                  onClick={handleAlertToggle}
                >
                  <span className="toggle-knob" />
                  <span className="toggle-label">
                    {alertsEnabled ? 'Alerts On' : 'Alerts Off'}
                  </span>
                </button>
              </div>
            </div>
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

      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ type: 'info', message: '' })}
      />
    </div>
  )
}

export default Home
