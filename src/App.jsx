import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PrivateRoute } from './contexts/PrivateRoute'
import Navbar from './components/Navbar'
import GoldCinematicBackground from './components/GoldCinematicBackground'
import GoldCoinRain from './components/GoldCoinRain'
import SideGoldCoinRain from './components/SideGoldCoinRain'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Calculator from './pages/Calculator'
import VerifyHUID from './pages/VerifyHUID'
import Learn from './pages/Learn'
import Complaint from './pages/Complaint'
import Profile from './pages/Profile'
import './styles/global.css'

/**
 * Gold Guardian Application Root Component
 * 
 * This component sets up the main routing structure, authentication context,
 * and layout. Protected pages require user authentication.
 */
function App() {
  const { i18n } = useTranslation()

  // Update HTML lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <div className="app-container">
      {/* Falling gold coins - background layer */}
      <GoldCoinRain />
      {/* Side gold coin waterfall - right strip only, behind content */}
      <SideGoldCoinRain />
      {/* Cinematic Gold Background with Parallax */}
      <GoldCinematicBackground />

      {/* Navigation Bar - persistent across all pages */}
      <Navbar />

      {/* Main Content Routes */}
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

              {/* Protected Routes - require authentication */}
              <Route
                path="/calculator"
                element={
                  <PrivateRoute>
                    <Calculator />
                  </PrivateRoute>
                }
              />
              <Route
                path="/verify-huid"
                element={
                  <PrivateRoute>
                    <VerifyHUID />
                  </PrivateRoute>
                }
              />
              <Route
                path="/learn"
                element={
                  <PrivateRoute>
                    <Learn />
                  </PrivateRoute>
                }
              />
              <Route
                path="/complaint"
                element={
                  <PrivateRoute>
                    <Complaint />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
