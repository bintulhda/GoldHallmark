import React, { createContext, useState, useEffect, useCallback } from 'react'
import { auth } from '../config/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // Signup
  const signup = useCallback(async (email, password, name) => {
    try {
      setError(null)
      const result = await createUserWithEmailAndPassword(auth, email, password)
      // Update user profile with display name
      if (name) {
        await updateProfile(result.user, { displayName: name })
      }
      return result.user
    } catch (err) {
      const message = getErrorMessage(err.code)
      setError(message)
      throw new Error(message)
    }
  }, [])

  // Login
  const login = useCallback(async (email, password) => {
    try {
      setError(null)
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (err) {
      const message = getErrorMessage(err.code)
      setError(message)
      throw new Error(message)
    }
  }, [])

  // Logout
  const logout = useCallback(async () => {
    try {
      setError(null)
      await signOut(auth)
    } catch (err) {
      setError(getErrorMessage(err.code))
      throw err
    }
  }, [])

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

function getErrorMessage(code) {
  const messages = {
    'auth/email-already-in-use': 'Email already registered. Try logging in.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/too-many-requests': 'Too many attempts. Try again later.',
  }
  return messages[code] || 'An error occurred. Please try again.'
}
