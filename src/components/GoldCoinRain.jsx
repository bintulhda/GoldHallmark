import React, { useMemo } from 'react'
import '../styles/goldCoinRain.css'

const COIN_COUNT = 22
const MIN_SIZE = 12
const MAX_SIZE = 28
const MIN_DURATION = 8
const MAX_DURATION = 18
const MAX_DRIFT = 80
const MAX_ROTATION = 720

function randomInRange(min, max) {
  return min + Math.random() * (max - min)
}

export default function GoldCoinRain() {
  const coins = useMemo(() => {
    return Array.from({ length: COIN_COUNT }, (_, i) => {
      const duration = randomInRange(MIN_DURATION, MAX_DURATION)
      const spread = duration * 0.85
      const delay = randomInRange(-spread, spread)
      return {
        id: i,
        left: randomInRange(0, 100),
        size: randomInRange(MIN_SIZE, MAX_SIZE),
        duration,
        delay,
        drift: randomInRange(-MAX_DRIFT, MAX_DRIFT),
        rotation: randomInRange(0, MAX_ROTATION) * (Math.random() > 0.5 ? 1 : -1),
      }
    })
  }, [])

  return (
    <div className="gold-coin-rain" aria-hidden="true">
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="gold-coin"
          style={{
            '--coin-left': `${coin.left}%`,
            '--coin-size': `${coin.size}px`,
            '--coin-duration': `${coin.duration}s`,
            '--coin-delay': `${coin.delay}s`,
            '--coin-drift': `${coin.drift}px`,
            '--coin-rotation': `${coin.rotation}deg`,
          }}
        >
          <span className="gold-coin__face" />
        </div>
      ))}
    </div>
  )
}
