import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../styles/profile.css'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    try {
      setLoading(true)
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
      setLoading(false)
    }
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="avatar-initials">
              {user?.displayName
                ? user.displayName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                : user?.email?.[0]?.toUpperCase()}
            </span>
          </div>
          <h1 className="profile-title">My Profile</h1>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h2>Account Information</h2>

            <div className="profile-item">
              <label>Full Name</label>
              <div className="profile-value">
                {user?.displayName || 'Not set'}
              </div>
            </div>

            <div className="profile-item">
              <label>Email Address</label>
              <div className="profile-value">
                {user?.email}
              </div>
            </div>

            <div className="profile-item">
              <label>Account Created</label>
              <div className="profile-value">
                {user?.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Unknown'}
              </div>
            </div>

            <div className="profile-item">
              <label>User ID</label>
              <div className="profile-value profile-uid">
                {user?.uid}
              </div>
            </div>

            <div className="profile-item">
              <label>Email Verified</label>
              <div className={`profile-value ${user?.emailVerified ? 'verified' : 'unverified'}`}>
                {user?.emailVerified ? '✓ Verified' : '✗ Not Verified'}
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Account Actions</h2>

            <button onClick={handleLogout} className="profile-logout-btn" disabled={loading}>
              {loading ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>

        <div className="profile-footer">
          <p>Need help? Contact support@goldguardian.com</p>
        </div>
      </div>
    </div>
  )
}
