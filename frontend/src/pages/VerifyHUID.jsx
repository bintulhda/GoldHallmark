import React, { useState } from 'react'
import { verifyHuidViaApi } from '../utils/api'
import '../styles/verify.css'

/**
 * HUID Verification Component
 * Verify BIS Hallmark codes against Firestore database
 */
function VerifyHUID() {
  const [huidCode, setHuidCode] = useState('')
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchHistory, setSearchHistory] = useState([])

  /**
   * Handle HUID verification
   */
  const handleVerify = async (e) => {
    e.preventDefault()

    if (!huidCode.trim()) {
      alert('Please enter a HUID code')
      return
    }

    setIsLoading(true)
    try {
      const apiResult = await verifyHuidViaApi(huidCode)
      
      // Transform API response to match UI expectations
      const verificationResult = {
        isValid: apiResult.success,
        message: apiResult.success ? '✅ Verified BIS Hallmark' : '❌ Invalid or Fake Jewellery',
        shop: apiResult.jewelerName || 'Unknown',
        city: apiResult.location || 'Unknown',
        purity: apiResult.goldPurity,
        status: apiResult.certificationStatus,
      }
      setResult(verificationResult)

      // Add to search history
      setSearchHistory((prev) => [huidCode, ...prev.slice(0, 4)])
    } catch (error) {
      console.error('Verification error:', error)
      setResult({
        isValid: false,
        message: 'Error connecting to database. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle quick search from history
   */
  const handleHistoryClick = async (code) => {
    setHuidCode(code)
    setIsLoading(true)
    try {
      const apiResult = await verifyHuidViaApi(code)
      
      const verificationResult = {
        isValid: apiResult.success,
        message: apiResult.success ? '✅ Verified BIS Hallmark' : '❌ Invalid or Fake Jewellery',
        shop: apiResult.jewelerName || 'Unknown',
        city: apiResult.location || 'Unknown',
        purity: apiResult.goldPurity,
        status: apiResult.certificationStatus,
      }
      setResult(verificationResult)
    } catch (error) {
      console.error('History verification error:', error)
      setResult({
        isValid: false,
        message: 'Error connecting to database. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="verify-page">
      <section className="verify-container">
        <h1>🔍 Verify BIS Hallmark</h1>
        <p className="subtitle">
          Enter HUID code to verify authentic BIS hallmarks
        </p>

        {/* Verification Form */}
        <form className="verify-form" onSubmit={handleVerify}>
          <div className="form-group">
            <label htmlFor="huidCode">HUID Code</label>
            <input
              id="huidCode"
              type="text"
              placeholder="E.g., AB1234, XY5678"
              value={huidCode}
              onChange={(e) => setHuidCode(e.target.value.toUpperCase())}
              className="form-input"
              maxLength="8"
            />
            <p className="helper-text">
              HUID is an 8-character code found on BIS hallmark label
            </p>
          </div>

          <button
            type="submit"
            className="btn-verify"
            disabled={isLoading || !huidCode}
          >
            {isLoading ? '⏳ Verifying...' : '✓ Verify HUID'}
          </button>
        </form>

        {/* Verification Result */}
        {result && (
          <div
            className={`verify-result ${result.isValid ? 'valid' : 'invalid'}`}
          >
            <h2>{result.message}</h2>

            {result.isValid && (
              <div className="result-details">
                <div className="detail-item">
                  <span className="label">Certified Shop:</span>
                  <span className="value">{result.shop}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Location:</span>
                  <span className="value">{result.city}</span>
                </div>
                {result.purity && (
                  <div className="detail-item">
                    <span className="label">Gold Purity:</span>
                    <span className="value">{result.purity}</span>
                  </div>
                )}
                {result.status && (
                  <div className="detail-item">
                    <span className="label">Certification Status:</span>
                    <span className="value">{result.status}</span>
                  </div>
                )}
                <p className="success-message">
                  ✅ This hallmark is registered with BIS. The jewellery is
                  authentic.
                </p>
              </div>
            )}

            {!result.isValid && (
              <div className="result-details">
                <p className="warning-message">
                  ❌ This HUID code is not registered or invalid. Be cautious of
                  this jewellery.
                </p>
                <p className="advice">
                  <strong>What to do:</strong> Do not purchase jewellery without
                  proper BIS hallmark. Report to nearest BIS office.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Search History */}
        {searchHistory.length > 0 && (
          <div className="search-history">
            <h3>Recent Searches</h3>
            <div className="history-chips">
              {searchHistory.map((code) => (
                <button
                  key={code}
                  className="history-chip"
                  onClick={() => handleHistoryClick(code)}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Information Section */}
        <div className="info-section">
          <h3>What is HUID?</h3>
          <p>
            <strong>HUID (Hallmark Unique Identification)</strong> is an 8-character
            alphanumeric code assigned by BIS to each hallmarked jewellery. It contains
            information about:
          </p>
          <ul>
            <li>Shop/jeweller identification</li>
            <li>Assaying centre code</li>
            <li>Year of hallmarking</li>
            <li>Jewellery serial number</li>
          </ul>

          <h3 style={{ marginTop: '2rem' }}>How to Find HUID?</h3>
          <p>
            Look for the BIS hallmark label on your jewellery. The HUID code is
            printed on this label. If you cannot find it, the jewellery may not be
            authentically hallmarked.
          </p>
        </div>
      </section>
    </div>
  )
}

export default VerifyHUID
