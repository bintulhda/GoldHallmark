import React, { useState } from 'react'
import { saveComplaint, generateComplaintLetter } from '../utils/firestore'
import '../styles/complaint.css'

/**
 * Complaint Generator Component
 * Generate and save formal complaints to BIS
 */
function Complaint() {
  const [formData, setFormData] = useState({
    customerName: '',
    shopName: '',
    city: '',
    issueDescription: '',
  })

  const [complaintLetter, setComplaintLetter] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)

  /**
   * Handle form input change
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (
      !formData.customerName ||
      !formData.shopName ||
      !formData.city ||
      !formData.issueDescription
    ) {
      alert('Please fill in all fields')
      return
    }

    setIsSubmitting(true)

    try {
      // Save to Firestore
      const complaintId = await saveComplaint(formData)

      // Generate complaint letter
      const letter = generateComplaintLetter(formData)
      setComplaintLetter(letter)

      // Show success message
      setSuccessMessage(`Complaint saved successfully! ID: ${complaintId}`)

      // Reset form
      setFormData({
        customerName: '',
        shopName: '',
        city: '',
        issueDescription: '',
      })

      // Clear messages after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (error) {
      console.error('Error saving complaint:', error)
      alert('Error saving complaint. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Copy complaint letter to clipboard
   */
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(complaintLetter)
      .then(() => {
        setCopiedToClipboard(true)
        setTimeout(() => {
          setCopiedToClipboard(false)
        }, 2000)
      })
      .catch(() => {
        alert('Failed to copy. Please try again.')
      })
  }

  /**
   * Download complaint as text file
   */
  const downloadComplaint = () => {
    const element = document.createElement('a')
    const file = new Blob([complaintLetter], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `BIS_Complaint_${Date.now()}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="complaint-page">
      <section className="complaint-container">
        <h1>📝 Generate BIS Complaint</h1>
        <p className="subtitle">
          Create a formal complaint letter against fraudulent gold jewellery
        </p>

        {/* Success Message */}
        {successMessage && (
          <div className="success-banner">
            <span>✅ {successMessage}</span>
          </div>
        )}

        <div className="complaint-content">
          {/* Form Section */}
          {!complaintLetter && (
            <div className="complaint-form-section">
              <form className="complaint-form" onSubmit={handleSubmit}>
                {/* Customer Name */}
                <div className="form-group">
                  <label htmlFor="customerName">Your Full Name *</label>
                  <input
                    id="customerName"
                    type="text"
                    name="customerName"
                    placeholder="Enter your full name"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                {/* Shop Name */}
                <div className="form-group">
                  <label htmlFor="shopName">Shop Name *</label>
                  <input
                    id="shopName"
                    type="text"
                    name="shopName"
                    placeholder="Name of jewellery shop"
                    value={formData.shopName}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                {/* City */}
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    placeholder="City where you bought jewellery"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                {/* Issue Description */}
                <div className="form-group">
                  <label htmlFor="issueDescription">
                    Describe the Issue *
                  </label>
                  <textarea
                    id="issueDescription"
                    name="issueDescription"
                    placeholder="Describe what happened. Example: Shop sold gold jewellery without proper BIS hallmark, or price was significantly overpriced..."
                    value={formData.issueDescription}
                    onChange={handleInputChange}
                    rows="6"
                    className="form-textarea"
                    required
                  ></textarea>
                  <span className="char-count">
                    {formData.issueDescription.length} characters
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '⏳ Generating...' : '✓ Generate Complaint'}
                </button>
              </form>

              {/* Information Section */}
              <div className="complaint-info">
                <h3>📋 About This Complaint</h3>
                <p>
                  This tool generates a formal complaint letter in the official
                  format. The letter will be:
                </p>
                <ul>
                  <li>✓ Saved to our database for tracking</li>
                  <li>✓ Generated in official complaint format</li>
                  <li>✓ Ready to submit to BIS</li>
                  <li>✓ Downloadable as a text file</li>
                </ul>

                <h3>🏢 Where to Submit?</h3>
                <p>
                  You can submit this complaint to:
                </p>
                <ul>
                  <li>
                    📧 <strong>Email:</strong> complaints@bis.gov.in
                  </li>
                  <li>
                    🏫 <strong>Visit:</strong> Nearest BIS office in your city
                  </li>
                  <li>
                    🌐 <strong>Online:</strong> bis.gov.in complaint portal
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Letter Display Section */}
          {complaintLetter && (
            <div className="letter-display-section">
              <h2>📄 Your Complaint Letter</h2>
              <p className="letter-info">
                Your formal complaint has been generated and saved. You can copy,
                download, or submit it to BIS.
              </p>

              {/* Letter Actions */}
              <div className="letter-actions">
                <button
                  onClick={copyToClipboard}
                  className="btn btn-action"
                  title="Copy to clipboard"
                >
                  {copiedToClipboard ? '✅ Copied!' : '📋 Copy Text'}
                </button>
                <button
                  onClick={downloadComplaint}
                  className="btn btn-action"
                  title="Download as file"
                >
                  ⬇️ Download
                </button>
                <button
                  onClick={() => {
                    setComplaintLetter(null)
                    setFormData({
                      customerName: '',
                      shopName: '',
                      city: '',
                      issueDescription: '',
                    })
                  }}
                  className="btn btn-action"
                  title="Create new complaint"
                >
                  ➕ New Complaint
                </button>
              </div>

              {/* Letter Content */}
              <div className="letter-content">
                <pre>{complaintLetter}</pre>
              </div>

              {/* Next Steps */}
              <div className="next-steps">
                <h3>📍 Next Steps</h3>
                <ol>
                  <li>Copy or download the complaint letter above</li>
                  <li>Print it if needed</li>
                  <li>
                    Submit it to BIS office in your city or via email:
                    complaints@bis.gov.in
                  </li>
                  <li>
                    Keep the complaint ID for reference:{' '}
                    <strong>{new Date().getTime()}</strong>
                  </li>
                  <li>BIS will investigate and respond within 30 days</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Complaint
