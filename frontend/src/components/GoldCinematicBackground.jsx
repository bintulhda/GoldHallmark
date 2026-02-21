import React, { useState, useEffect, useRef } from 'react'
import '../styles/goldCinematicBackground.css'

/**
 * GoldCinematicBackground Component
 * Renders a luxurious cinematic parallax background with floating gold elements
 * Mouse movement triggers subtle parallax effects across depth layers
 */
export default function GoldCinematicBackground() {
  const containerRef = useRef(null)
  const glowRef = useRef(null)
  const barsRef = useRef(null)
  const ringRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height

      // Parallax calculations - max 15px offset
      const offsetX = (x - 0.5) * 30
      const offsetY = (y - 0.5) * 30

      // Layer 1: Glow (least movement)
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${offsetX * 0.3}px, ${offsetY * 0.3}px)`
      }

      // Layer 2: Gold bars (moderate movement)
      if (barsRef.current) {
        barsRef.current.style.transform = `translate(${offsetX * 0.5}px, ${offsetY * 0.5}px)`
      }

      // Layer 3: Gold ring (most movement)
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${offsetX * 0.7}px, ${offsetY * 0.7}px)`
      }
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => {
      setIsHovering(false)
      // Reset positions on mouse leave
      if (glowRef.current) glowRef.current.style.transform = 'translate(0, 0)'
      if (barsRef.current) barsRef.current.style.transform = 'translate(0, 0)'
      if (ringRef.current) ringRef.current.style.transform = 'translate(0, 0)'
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseenter', handleMouseEnter)
      window.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        container.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseenter', handleMouseEnter)
        window.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  useEffect(() => {
    // Smooth transition disabling on hover
    const container = containerRef.current
    if (container) {
      container.classList.toggle('hovering', isHovering)
    }
  }, [isHovering])

  return (
    <div className="cinematic-bg-container" ref={containerRef} aria-hidden="true">
      {/* Layer 1: Glow Depth */}
      <div className="cinematic-glow-layer" ref={glowRef}>
        <div className="glow-orb glow-primary" />
        <div className="glow-orb glow-secondary" />
      </div>

      {/* Layer 2: Floating Gold Bars */}
      <div className="cinematic-bars-layer" ref={barsRef}>
        <svg
          className="floating-bars-svg"
          viewBox="0 0 300 600"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <filter id="goldGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Gold bar cluster 1 */}
          <rect x="30" y="50" width="12" height="80" fill="#D9A945" opacity="0.10" filter="url(#goldGlow)" />
          <rect x="50" y="40" width="10" height="95" fill="#D9A945" opacity="0.08" filter="url(#goldGlow)" />
          <rect x="70" y="60" width="11" height="75" fill="#D9A945" opacity="0.09" filter="url(#goldGlow)" />

          {/* Gold bar cluster 2 */}
          <rect x="200" y="300" width="13" height="85" fill="#D9A945" opacity="0.09" filter="url(#goldGlow)" />
          <rect x="220" y="290" width="11" height="100" fill="#D9A945" opacity="0.07" filter="url(#goldGlow)" />
          <rect x="240" y="310" width="12" height="80" fill="#D9A945" opacity="0.08" filter="url(#goldGlow)" />
        </svg>
      </div>

      {/* Layer 3: Rotating Gold Ring */}
      <div className="cinematic-ring-layer" ref={ringRef}>
        <svg
          className="rotating-ring-svg"
          viewBox="0 0 400 400"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid"
        >
          <defs>
            <filter id="ringGlow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer rings */}
          <circle
            cx="200"
            cy="200"
            r="120"
            fill="none"
            stroke="#D9A945"
            strokeWidth="1.5"
            opacity="0.12"
            filter="url(#ringGlow)"
          />
          <circle
            cx="200"
            cy="200"
            r="100"
            fill="none"
            stroke="#D9A945"
            strokeWidth="1"
            opacity="0.10"
            filter="url(#ringGlow)"
          />
          <circle
            cx="200"
            cy="200"
            r="80"
            fill="none"
            stroke="#D9A945"
            strokeWidth="0.8"
            opacity="0.08"
            filter="url(#ringGlow)"
          />

          {/* Central emblem */}
          <g opacity="0.09">
            <circle cx="200" cy="200" r="60" fill="none" stroke="#D9A945" strokeWidth="1" filter="url(#ringGlow)" />
            <polygon
              points="200,150 215,175 240,175 220,190 228,215 200,200 172,215 180,190 160,175 185,175"
              fill="#D9A945"
              opacity="0.7"
            />
          </g>
        </svg>
      </div>

      {/* Cinematic vignette effect */}
      <div className="cinematic-vignette" />

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

      {/* Floating Elements Layer */}
      <div className="floating-elements-layer" aria-hidden="true">
        <div className="floating-element floating-bars-element" style={{ animationDelay: '0s' }}>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="20" width="8" height="50" fill="#D9A945" opacity="0.08" />
            <rect x="25" y="15" width="8" height="55" fill="#D9A945" opacity="0.06" />
            <rect x="40" y="25" width="8" height="45" fill="#D9A945" opacity="0.07" />
          </svg>
        </div>
        <div className="floating-element floating-shield-element" style={{ animationDelay: '2s' }}>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 10 L30 25 L30 50 A20 20 0 0 0 50 80 A20 20 0 0 0 70 50 L70 25 Z" fill="none" stroke="#D9A945" strokeWidth="1.5" opacity="0.06" />
          </svg>
        </div>
        <div className="floating-element floating-jewel-element" style={{ animationDelay: '4s' }}>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 15 L65 35 L60 55 L50 65 L40 55 L35 35 Z" fill="none" stroke="#D9A945" strokeWidth="1" opacity="0.07" />
          </svg>
        </div>
      </div>
    </div>
  )
}
