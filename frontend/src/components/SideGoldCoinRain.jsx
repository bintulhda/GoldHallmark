import React, { useMemo } from 'react'
import '../styles/sideGoldCoinRain.css'

const COIN_COUNT = 32
const MIN_SIZE = 22
const MAX_SIZE = 52
const MIN_DURATION = 7
const MAX_DURATION = 15
const MAX_DRIFT = 35
const MAX_ROTATION = 480

function randomInRange(min, max) {
  return min + Math.random() * (max - min)
}

export default function SideGoldCoinRain() {
  const coins = useMemo(() => {
    return Array.from({ length: COIN_COUNT }, (_, i) => {
      const duration = randomInRange(MIN_DURATION, MAX_DURATION)
      const spread = duration * 1.15
      const biasLower = Math.random() < 0.65
      const delay = biasLower ? randomInRange(-spread, 0.15 * spread) : randomInRange(-spread, spread)
      const biasRight = Math.random() < 0.7
      const left = biasRight ? randomInRange(45, 100) : randomInRange(25, 95)
      const tilt = randomInRange(-12, 12)
      return {
        id: i,
        left,
        size: randomInRange(MIN_SIZE, MAX_SIZE),
        duration,
        delay,
        drift: randomInRange(-MAX_DRIFT, MAX_DRIFT),
        rotation: randomInRange(0, MAX_ROTATION) * (Math.random() > 0.5 ? 1 : -1),
        tilt,
      }
    })
  }, [])

  return (
    <div className="side-gold-coin-rain" aria-hidden="true">
      <div className="side-gold-coin-rain__glow" />
      <div className="side-gold-coin-rain__strip">
        {coins.map((coin) => (
          <div
            key={coin.id}
            className="side-gold-coin"
            style={{
              '--coin-left': `${coin.left}%`,
              '--coin-size': `${coin.size}px`,
              '--coin-duration': `${coin.duration}s`,
              '--coin-delay': `${coin.delay}s`,
              '--coin-drift': `${coin.drift}px`,
              '--coin-rotation': `${coin.rotation}deg`,
              '--coin-tilt': `${coin.tilt}deg`,
            }}
          >
            <span className="side-gold-coin__face" />
          </div>
        ))}
      </div>
      <div className="side-gold-coin-rain__pile" aria-hidden="true">
        <span className="side-gold-coin-rain__pile-coin side-gold-coin-rain__pile-coin--1" />
        <span className="side-gold-coin-rain__pile-coin side-gold-coin-rain__pile-coin--2" />
        <span className="side-gold-coin-rain__pile-coin side-gold-coin-rain__pile-coin--3" />
        <span className="side-gold-coin-rain__pile-coin side-gold-coin-rain__pile-coin--4" />
        <span className="side-gold-coin-rain__pile-coin side-gold-coin-rain__pile-coin--5" />
        <span className="side-gold-coin-rain__pile-coin side-gold-coin-rain__pile-coin--6" />
        <span className="side-gold-coin-rain__pile-coin side-gold-coin-rain__pile-coin--7" />
      </div>
    </div>
  )
}
