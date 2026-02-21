import React, { useState, useEffect } from 'react'
import {
  calculateGoldPrice,
  getSafetyVerdict,
  fetchGoldRate,
} from '../utils/goldCalculator'
import '../styles/calculator.css'

/**
 * Gold Price Calculator Component
 * Main feature: Calculate jewellery prices and detect fraud
 */
function Calculator() {
  // Form state
  const [weight, setWeight] = useState(10)
  const [purity, setPurity] = useState(22)
  const [goldRate, setGoldRate] = useState(7500)
  const [makingCharge, setMakingCharge] = useState(10)
  const [isLoadingRate, setIsLoadingRate] = useState(false)

  // Results
  const [calculations, setCalculations] = useState(null)
  const [verdict, setVerdict] = useState(null)

  // Fetch live gold rate on component mount
  useEffect(() => {
    loadGoldRate()
  }, [])

  /**
   * Load live gold rate from Firebase Cloud Function
   */
  const loadGoldRate = async () => {
    setIsLoadingRate(true)
    try {
      const rate = await fetchGoldRate()
      setGoldRate(rate)
    } catch (error) {
      console.error('Failed to load gold rate:', error)
      // Fallback rate already set
    } finally {
      setIsLoadingRate(false)
    }
  }

  /**
   * Handle calculation on input change
   */
  useEffect(() => {
    if (weight && purity && goldRate && makingCharge) {
      const results = calculateGoldPrice(weight, purity, goldRate, makingCharge)
      setCalculations(results)

      const safetyVerdict = getSafetyVerdict(results.overpaymentPercent)
      setVerdict(safetyVerdict)
    }
  }, [weight, purity, goldRate, makingCharge])

  return (
    <div className="calculator-page">
      <section className="calculator-container">
        <h1>🧮 Gold Price Calculator</h1>
        <p className="subtitle">
          Calculate fair price and detect fraud in real-time
        </p>

        <div className="calculator-content">
          {/* Input Form */}
          <div className="calculator-form">
            <div className="form-section">
              <h2>Enter Details</h2>

              {/* Weight Input */}
              <div className="form-group">
                <label htmlFor="weight">Weight (grams)</label>
                <input
                  id="weight"
                  type="number"
                  min="0.5"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value))}
                  className="form-input"
                />
                <span className="input-range">0.5 - 500g</span>
              </div>

              {/* Purity Dropdown */}
              <div className="form-group">
                <label htmlFor="purity">Gold Purity</label>
                <select
                  id="purity"
                  value={purity}
                  onChange={(e) => setPurity(parseInt(e.target.value))}
                  className="form-select"
                >
                  <option value={24}>24K (99.9% pure)</option>
                  <option value={22}>22K (91.6% pure)</option>
                  <option value={18}>18K (75% pure)</option>
                  <option value={14}>14K (58.3% pure)</option>
                </select>
              </div>

              {/* Gold Rate Input */}
              <div className="form-group">
                <label htmlFor="goldRate">
                  Live Gold Rate (₹/gram)
                  {isLoadingRate && <span className="loading"> Loading...</span>}
                </label>
                <div className="gold-rate-input-group">
                  <input
                    id="goldRate"
                    type="number"
                    min="0"
                    value={goldRate}
                    onChange={(e) => setGoldRate(parseFloat(e.target.value))}
                    className="form-input"
                  />
                  <button
                    onClick={loadGoldRate}
                    className="btn-refresh"
                    disabled={isLoadingRate}
                    title="Refresh from live API"
                  >
                    🔄 Refresh
                  </button>
                </div>
                <span className="input-range">Updated from live market</span>
              </div>

              {/* Making Charge */}
              <div className="form-group">
                <label htmlFor="makingCharge">
                  Making Charge (%)
                  <span className="range-display">{makingCharge}%</span>
                </label>
                <input
                  id="makingCharge"
                  type="range"
                  min="0"
                  max="30"
                  step="0.5"
                  value={makingCharge}
                  onChange={(e) => setMakingCharge(parseFloat(e.target.value))}
                  className="form-range-slider"
                />
                <div className="range-labels">
                  <span>0%</span>
                  <span>15%</span>
                  <span>30%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="calculator-results">
            {calculations && verdict && (
              <>
                {/* Verdict Card */}
                <div
                  className="verdict-card"
                  style={{
                    borderColor: verdict.color,
                    backgroundColor: `${verdict.color}15`,
                  }}
                >
                  <div className="verdict-header">
                    <div className="verdict-icon">{verdict.icon}</div>
                    <div>
                      <h2 style={{ color: verdict.color }}>
                        {verdict.status}
                      </h2>
                      <p>{verdict.message}</p>
                    </div>
                  </div>

                  {/* Overpayment Indicator */}
                  <div className="overpayment-indicator">
                    <span>Overpayment:</span>
                    <span
                      className="overpayment-percent"
                      style={{ color: verdict.color }}
                    >
                      {calculations.overpaymentPercent}%
                    </span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="price-breakdown">
                  <h3>Price Breakdown</h3>

                  <div className="breakdown-grid">
                    <div className="breakdown-item">
                      <span className="item-label">Pure Gold Weight</span>
                      <span className="item-value">
                        {calculations.pureGoldWeight}g
                      </span>
                    </div>

                    <div className="breakdown-item">
                      <span className="item-label">Gold Value (98% of market)</span>
                      <span className="item-value">
                        ₹{parseFloat(calculations.goldValue).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="breakdown-item">
                      <span className="item-label">Making Charges</span>
                      <span className="item-value">
                        ₹{parseFloat(calculations.makingChargesValue).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="breakdown-item">
                      <span className="item-label">GST (3%)</span>
                      <span className="item-value">
                        ₹{parseFloat(calculations.gstAmount).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="breakdown-item highlight">
                      <span className="item-label">Fair Price (Expected)</span>
                      <span
                        className="item-value"
                        style={{ fontSize: '1.3em', fontWeight: 'bold' }}
                      >
                        ₹{parseFloat(calculations.finalPrice).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="breakdown-item">
                      <span className="item-label">Buyback Value (98% of gold)</span>
                      <span className="item-value">
                        ₹{parseFloat(calculations.buybackValue).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="breakdown-item">
                      <span className="item-label">Extra Amount (Profit Margin)</span>
                      <span className="item-value">
                        ₹{parseFloat(calculations.extraAmountPaid).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Comparison Card */}
                <div className="comparison-card">
                  <h3>For Your Reference</h3>
                  <p>
                    <strong>Fair Price Range:</strong> ₹
                    {parseFloat(calculations.finalPrice).toLocaleString('en-IN')} to ₹
                    {(
                      parseFloat(calculations.finalPrice) * 1.05
                    ).toLocaleString('en-IN')}
                  </p>
                  <p>
                    If the shop is asking more than the Fair Price, compare with 2-3
                    other shops before buying.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Calculator
