'use client'

import { createContext, useContext, useSyncExternalStore } from 'react'
import {
  getStoredSession,
  loginWithCredentials,
  loginWithGoogle,
  logout,
  registerWithCredentials,
  subscribeToAuth,
} from '@/services/auth'

const AuthContext = createContext(null)
const emptySubscribe = () => () => {}

export function AuthProvider({ children }) {
  const session = useSyncExternalStore(subscribeToAuth, getStoredSession, () => null)
  const isReady = useSyncExternalStore(emptySubscribe, () => true, () => false)

  const handleLogin = async (credentials) => {
    return loginWithCredentials(credentials)
  }

  const handleRegister = async (payload) => {
    return registerWithCredentials(payload)
  }

  const handleGoogleLogin = async () => {
    return loginWithGoogle()
  }

  const handleLogout = async () => {
    await logout()
  }

  const value = {
    session,
    user: session?.user ?? null,
    isAuthenticated: Boolean(session?.user),
    isReady,
    login: handleLogin,
    register: handleRegister,
    signInWithGoogle: handleGoogleLogin,
    signOut: handleLogout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}