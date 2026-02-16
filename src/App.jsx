import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Calculator from './pages/Calculator'
import VerifyHUID from './pages/VerifyHUID'
import Learn from './pages/Learn'
import Complaint from './pages/Complaint'
import './styles/global.css'

/**
 * Gold Guardian Application Root Component
 * 
 * This component sets up the main routing structure and layout
 * All pages are nested under the Navbar component
 */
function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Navigation Bar - persistent across all pages */}
        <Navbar />

        {/* Main Content Routes */}
        <main className="main-content">
          <Routes>
            {/* Home/Landing Page */}
            <Route path="/" element={<Home />} />

            {/* Gold Price Calculator Feature */}
            <Route path="/calculator" element={<Calculator />} />

            {/* HUID Verification Feature */}
            <Route path="/verify-huid" element={<VerifyHUID />} />

            {/* Educational Content */}
            <Route path="/learn" element={<Learn />} />

            {/* Complaint Generator */}
            <Route path="/complaint" element={<Complaint />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
