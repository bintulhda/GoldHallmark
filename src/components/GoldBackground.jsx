import React from 'react'
import '../styles/goldBackground.css'

/**
 * GoldBackground Component
 * Renders animated gold-themed decorative elements in the background
 * Includes floating elements and falling coins animation
 */
export default function GoldBackground() {
  return (
    <div className="gold-background-container">
      {/* Floating Gold Elements */}
      <div className="floating-element floating-bars" aria-hidden="true">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="20" width="8" height="50" fill="#D9A945" opacity="0.12" />
          <rect x="25" y="15" width="8" height="55" fill="#D9A945" opacity="0.10" />
          <rect x="40" y="25" width="8" height="45" fill="#D9A945" opacity="0.11" />
        </svg>
      </div>

      <div className="floating-element floating-ring" aria-hidden="true">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="30" fill="none" stroke="#D9A945" strokeWidth="1.5" opacity="0.10" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="#D9A945" strokeWidth="1" opacity="0.08" />
        </svg>
      </div>

      <div className="floating-element floating-shield" aria-hidden="true">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M50 10 L30 25 L30 50 A20 20 0 0 0 50 80 A20 20 0 0 0 70 50 L70 25 Z"
            fill="none"
            stroke="#D9A945"
            strokeWidth="1.2"
            opacity="0.09"
          />
        </svg>
      </div>

      <div className="floating-element floating-jewel" aria-hidden="true">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M50 15 L65 35 L60 55 L50 65 L40 55 L35 35 Z"
            fill="none"
            stroke="#D9A945"
            strokeWidth="1"
            opacity="0.10"
          />
        </svg>
      </div>

      <div className="floating-element floating-emblem" aria-hidden="true">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="35" fill="none" stroke="#D9A945" strokeWidth="0.8" opacity="0.08" />
          <polygon
            points="50,25 61,40 75,40 64,50 69,65 50,55 31,65 36,50 25,40 39,40"
            fill="#D9A945"
            opacity="0.07"
          />
        </svg>
      </div>

      <div className="floating-element floating-lines" aria-hidden="true">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <line x1="20" y1="50" x2="80" y2="50" stroke="#D9A945" strokeWidth="0.6" opacity="0.08" />
          <path d="M20 80 Q50 20 80 80" fill="none" stroke="#D9A945" strokeWidth="0.8" opacity="0.07" />
        </svg>
      </div>

      {/* Falling Coins Container */}
      <div className="coins-container" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`coin-${i}`}
            className="falling-coin"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 1.5}s`,
            }}
          >
            <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="none" stroke="#D9A945" strokeWidth="1.5" opacity="0.12" />
              <circle cx="20" cy="20" r="14" fill="none" stroke="#D9A945" strokeWidth="0.8" opacity="0.10" />
              <text
                x="20"
                y="23"
                textAnchor="middle"
                fontSize="12"
                fill="#D9A945"
                opacity="0.08"
                fontWeight="bold"
              >
                ₹
              </text>
            </svg>
          </div>
        ))}
      </div>

      {/* Glow Accents */}
      <div className="glow-accent glow-1" aria-hidden="true" />
      <div className="glow-accent glow-2" aria-hidden="true" />
      <div className="glow-accent glow-3" aria-hidden="true" />
    </div>
  )
}
