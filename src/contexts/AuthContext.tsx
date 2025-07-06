'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  fullName: string
  role: 'user' | 'admin'
  status: string
  isVerified: boolean
  profile: {
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
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session on mount
    verifySession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const verifySession = async () => {
    try {
      const response = await fetch('/api/auth/verify')

      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else {
        // Session is invalid, but don't redirect on public pages
        const currentPath = window.location.pathname
        const publicPaths = ['/', '/auth/signin', '/auth/signup', '/templates', '/ats-score', '/pricing', '/help-center', '/contact-us', '/privacy-policy', '/about', '/blog', '/careers']
        const isPublicPath = publicPaths.some(path => currentPath === path || currentPath.startsWith(path))

        if (!isPublicPath) {
          router.push('/auth/signin')
        }
      }
    } catch (error) {
      console.error('Session verification error:', error)
      // Don't redirect on public pages even on error
      const currentPath = window.location.pathname
      const publicPaths = ['/', '/auth/signin', '/auth/signup', '/templates', '/ats-score', '/pricing', '/help-center', '/contact-us', '/privacy-policy', '/about', '/blog', '/careers']
      const isPublicPath = publicPaths.some(path => currentPath === path || currentPath.startsWith(path))

      if (!isPublicPath) {
        router.push('/auth/signin')
      }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Session is automatically set via cookie
        setUser(data.user)
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error: 'An error occurred during sign in' }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, fullName }),
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Sign up error:', error)
      return { success: false, error: 'An error occurred during sign up' }
    }
  }

  const signOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
    } catch (error) {
      console.error('Sign out error:', error)
    }
    setUser(null)
    router.push('/auth/signin')
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  const value = {
    user,
    loading,
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

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}