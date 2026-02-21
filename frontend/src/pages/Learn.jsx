import React from 'react'
import '../styles/learn.css'

/**
 * Hallmark Education Component
 * Educational cards explaining BIS hallmarks
 */
function Learn() {
  const hallmarkContent = [
    {
      id: 1,
      icon: '🏢',
      title: 'BIS Logo',
      description:
        'The official Bureau of Indian Standards logo. This symbol guarantees that the jewellery has been tested and verified by BIS. Always look for "916" (22K) or "999" (24K) next to it.',
      details: [
        'Indicates official BIS hallmark',
        'Jewellery is certified authentic',
        'Shop is registered with BIS',
      ],
    },
    {
      id: 2,
      icon: '💎',
      title: 'Purity Mark',
      description:
        'Shows the purity of gold in the jewellery. This is the most important mark. Common marks are 916 (22K), 999 (24K), 750 (18K), and 585 (14K).',
      details: [
        '999 = 24K (99.9% pure)',
        '916 = 22K (91.6% pure)',
        '750 = 18K (75% pure)',
        '585 = 14K (58.3% pure)',
      ],
    },
    {
      id: 3,
      icon: '🔐',
      title: 'HUID Number',
      description:
        'Unique 8-character code assigned to each hallmarked piece. This code links your jewellery to the testing lab and date of hallmarking. You can verify this code online.',
      details: [
        'Unique identification for each jewel',
        'Can be verified on BIS portal',
        'Links to assay centre and date',
      ],
    },
    {
      id: 4,
      icon: '👨‍💼',
      title: 'Jeweller Mark',
      description:
        'The identification mark of the jeweller who submitted the jewellery for hallmarking. This helps trace the jewellery back to its original maker.',
      details: [
        'Shop/jeweller identification',
        'Unique to each registered jeweller',
        'Ensures accountability and traceability',
      ],
    },
    {
      id: 5,
      icon: '📅',
      title: 'Assay Centre',
      description:
        'Symbol of the approved testing centre where the jewellery was tested. Different assay centres have different symbols. This ensures the testing was done officially.',
      details: [
        'Testing lab identification',
        'Official hallmarking location',
        'Ensures quality standards',
      ],
    },
    {
      id: 6,
      icon: '⚠️',
      title: 'Fake Hallmarks (Red Flag)',
      description:
        'Be alert! Counterfeiters sometimes copy BIS hallmark logos. Real BIS hallmarks are engraved clearly on metal, not printed on labels.',
      details: [
        'Check if marks are engraved on metal',
        'Printed labels are NOT official',
        'Ask jeweller for certificate',
        'Verify HUID online after purchase',
      ],
    },
  ]

  return (
    <div className="learn-page">
      <section className="learn-container">
        <h1>📚 Learn About BIS Hallmarks</h1>
        <p className="subtitle">
          Understand hallmark components and avoid counterfeit jewellery
        </p>

        {/* Hallmark Education Cards */}
        <div className="hallmark-grid">
          {hallmarkContent.map((item) => (
            <div key={item.id} className="hallmark-card">
              <div className="card-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p className="card-description">{item.description}</p>

              <div className="card-details">
                {item.details.map((detail, idx) => (
                  <div key={idx} className="detail">
                    ✓ {detail}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <section className="additional-info">
          <div className="info-card">
            <h2>🛡️ Official Hallmark Components</h2>
            <p>
              A genuine BIS hallmark on your jewellery consists of 5 symbols:
            </p>
            <div className="components-list">
              <div className="component">
                <span className="component-num">1</span>
                <span>BIS Logo (official stamp)</span>
              </div>
              <div className="component">
                <span className="component-num">2</span>
                <span>Three-digit purity code (916, 999, etc.)</span>
              </div>
              <div className="component">
                <span className="component-num">3</span>
                <span>Assay centre symbol</span>
              </div>
              <div className="component">
                <span className="component-num">4</span>
                <span>Jeweller identification mark</span>
              </div>
              <div className="component">
                <span className="component-num">5</span>
                <span>Year mark (last 2 digits of year)</span>
              </div>
            </div>
          </div>

          <div className="info-card warning">
            <h2>⚠️ How to Spot Fake Hallmarks</h2>
            <ul>
              <li>🚫 Hallmark is printed on label (not engraved on metal)</li>
              <li>🚫 Hallmark is blurry or not clear</li>
              <li>🚫 HUID code cannot be verified online</li>
              <li>🚫 Jeweller refuses to provide hallmark certificate</li>
              <li>🚫 Price is unusually low for the weight and purity</li>
              <li>🚫 Jewellery is from unknown or unregistered shop</li>
            </ul>
          </div>

          <div className="info-card">
            <h2>✅ Steps to Verify Authentic Hallmark</h2>
            <ol>
              <li>
                <strong>Check the metal:</strong> Ensure hallmark is engraved on
                the jewellery itself
              </li>
              <li>
                <strong>Locate HUID:</strong> Find the 8-character HUID code
              </li>
              <li>
                <strong>Check purity code:</strong> Verify it matches stated purity
              </li>
              <li>
                <strong>Verify online:</strong> Use our verification tool to check
                HUID
              </li>
              <li>
                <strong>Get certificate:</strong> Ask for official hallmark
                certificate
              </li>
              <li>
                <strong>Compare prices:</strong> Use our calculator to ensure fair
                pricing
              </li>
            </ol>
          </div>
        </section>

        {/* Call to Action */}
        <section className="learn-cta">
          <h2>Ready to Verify Your Jewellery?</h2>
          <p>
            Use our tools to verify HUID and calculate fair prices for your gold
            purchases.
          </p>
          <div className="cta-buttons">
            <a href="/verify-huid" className="btn btn-primary">
              Verify HUID
            </a>
            <a href="/calculator" className="btn btn-secondary">
              Calculate Price
            </a>
          </div>
        </section>
      </section>
    </div>
  )
}

export default Learn
