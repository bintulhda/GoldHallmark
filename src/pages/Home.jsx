import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation('common')
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
            <h2>{t('whatsapp.title')}</h2>
            <p className="whatsapp-subtitle">
              {t('whatsapp.subtitle')}
            </p>

            <ul className="whatsapp-benefits">
              <li>💬 {t('whatsapp.benefit1')}</li>
              <li>⚡ {t('whatsapp.benefit2')}</li>
              <li>📈 {t('whatsapp.benefit3')}</li>
            </ul>

            <a href={whatsappLink} target="_blank" rel="noreferrer" className="btn btn-whatsapp">
              {t('whatsapp.button')}
            </a>

            <p className="whatsapp-helper">
              {t('whatsapp.helper')}
            </p>
          </div>

          <div className="whatsapp-actions glass-card">
            <h3>{t('whatsapp.tryWebsite')}</h3>

            {/* Quick HUID verification */}
            <form className="quick-verify-form" onSubmit={handleQuickVerify}>
              <label htmlFor="quickHuid">{t('whatsapp.quickCheck')}</label>
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
                  {quickLoading ? t('whatsapp.checking') : t('whatsapp.verify')}
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
              <h4>{t('whatsapp.alertsTitle')}</h4>
              <p className="alerts-caption">
                {t('whatsapp.alertsCaption')}
              </p>
              <div className="alerts-controls">
                <input
                  type="tel"
                  placeholder={t('whatsapp.alertsPlaceholder')}
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
                    {alertsEnabled ? t('whatsapp.alertsOn') : t('whatsapp.alertsOff')}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features">
        <h2>{t('features.title')}</h2>

        <div className="features-grid">
          {/* Feature 1 */}
          <div className="feature-card">
            <div className="feature-icon">🧮</div>
            <h3>{t('features.calculator.title')}</h3>
            <p>
              {t('features.calculator.description')}
            </p>
            <a href="/calculator" className="feature-link">
              {t('features.calculator.link')} →
            </a>
          </div>

          {/* Feature 2 */}
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>{t('features.verification.title')}</h3>
            <p>
              {t('features.verification.description')}
            </p>
            <a href="/verify-huid" className="feature-link">
              {t('features.verification.link')} →
            </a>
          </div>

          {/* Feature 3 */}
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>{t('features.education.title')}</h3>
            <p>
              {t('features.education.description')}
            </p>
            <a href="/learn" className="feature-link">
              {t('features.education.link')} →
            </a>
          </div>

          {/* Feature 4 */}
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>{t('features.complaint.title')}</h3>
            <p>
              {t('features.complaint.description')}
            </p>
            <a href="/complaint" className="feature-link">
              {t('features.complaint.link')} →
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>{t('howItWorks.title')}</h2>

        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>{t('howItWorks.step1.title')}</h3>
            <p>{t('howItWorks.step1.description')}</p>
          </div>

          <div className="arrow">→</div>

          <div className="step">
            <div className="step-number">2</div>
            <h3>{t('howItWorks.step2.title')}</h3>
            <p>{t('howItWorks.step2.description')}</p>
          </div>

          <div className="arrow">→</div>

          <div className="step">
            <div className="step-number">3</div>
            <h3>{t('howItWorks.step3.title')}</h3>
            <p>{t('howItWorks.step3.description')}</p>
          </div>

          <div className="arrow">→</div>

          <div className="step">
            <div className="step-number">4</div>
            <h3>{t('howItWorks.step4.title')}</h3>
            <p>{t('howItWorks.step4.description')}</p>
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
