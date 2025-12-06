'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface UserProfile {
  id: string
  email: string
  fullName: string
  avatarUrl?: string
  role: 'user' | 'admin'
  status: string
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

interface User {
  id: string
  email: string
  fullName: string
  role: 'user' | 'admin'
  status: string
  isVerified: boolean
  profile: UserProfile
}

interface AuthResult {
  success: boolean
  error?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isSigningOut: boolean
  signIn: (email: string, password: string) => Promise<AuthResult>
  signUp: (email: string, password: string, fullName: string) => Promise<AuthResult>
  signOut: () => Promise<void>
  updateUser: (userData: Partial<User>) => void
}

const PUBLIC_PATHS = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/templates',
  '/ats-score',
  '/help-center',
  '/contact-us',
  '/privacy-policy',
  '/about',
  '/blog',
  '/careers',
  '/resume/new',
]

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(path))
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()

  const verifySession = useCallback(async () => {
    if (isSigningOut) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/verify')

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        const currentPath = window.location.pathname
        if (!isPublicPath(currentPath)) {
          router.push('/auth/signin')
        }
      }
    } catch {
      const currentPath = window.location.pathname
      if (!isPublicPath(currentPath)) {
        router.push('/auth/signin')
      }
    } finally {
      setLoading(false)
    }
  }, [isSigningOut, router])

  useEffect(() => {
    verifySession()
  }, [verifySession])

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        return { success: true }
      }

      return { success: false, error: data.error }
    } catch {
      return { success: false, error: 'An error occurred during sign in' }
    }
  }

  const signUp = async (email: string, password: string, fullName: string): Promise<AuthResult> => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName }),
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true }
      }

      return { success: false, error: data.error }
    } catch {
      return { success: false, error: 'An error occurred during sign up' }
    }
  }

  const signOut = async (): Promise<void> => {
    setIsSigningOut(true)
    setUser(null)

    try {
      await fetch('/api/auth/signout', { method: 'POST' })
    } catch {
      // Continue with sign out even if API fails
    }

    router.push('/auth/signin')
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    isSigningOut,
    signIn,
    signUp,
    signOut,
    updateUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
