import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../styles/profile.css'

export default function Profile() {
  const { user, logout, updateUserProfile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editName, setEditName] = useState(user?.displayName || '')
  const [editError, setEditError] = useState('')
  const [editLoading, setEditLoading] = useState(false)

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

  const handleEditClick = () => {
    setEditName(user?.displayName || '')
    setEditError('')
    setIsEditMode(true)
  }

  const handleCancel = () => {
    setEditName(user?.displayName || '')
    setEditError('')
    setIsEditMode(false)
  }

  const handleSave = async () => {
    if (!editName.trim()) {
      setEditError('Name cannot be empty')
      return
    }

    try {
      setEditLoading(true)
      setEditError('')
      await updateUserProfile(editName)
      setIsEditMode(false)
    } catch (error) {
      console.error('Update failed:', error)
      setEditError(error.message || 'Failed to update profile')
    } finally {
      setEditLoading(false)
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
              {isEditMode ? (
                <input
                  type="text"
                  className="profile-edit-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter your name"
                />
              ) : (
                <div className="profile-value">
                  {user?.displayName || 'Not set'}
                </div>
              )}
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

            {isEditMode && editError && (
              <div className="profile-error-message">
                {editError}
              </div>
            )}
          </div>

          <div className="profile-section">
            <h2>Account Actions</h2>

            {isEditMode ? (
              <div className="profile-edit-actions">
                <button
                  onClick={handleSave}
                  className="profile-save-btn"
                  disabled={editLoading}
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  className="profile-cancel-btn"
                  disabled={editLoading}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={handleEditClick}
                  className="profile-edit-btn"
                >
                  Edit Profile
                </button>
                <button onClick={handleLogout} className="profile-logout-btn" disabled={loading}>
                  {loading ? 'Logging out...' : 'Logout'}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="profile-footer">
          <p>Need help? Contact support@goldguardian.com</p>
        </div>
      </div>
    </div>
  )
}
