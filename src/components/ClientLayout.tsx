'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Navigation from '@/components/Navigation'
import { AuthProvider } from '@/contexts/AuthContext'

const PAGES_WITH_NAVIGATION = [
  '/templates',
  '/ats-score',
  '/help-center',
  '/contact-us',
  '/privacy-policy',
  '/about',
  '/blog',
  '/careers',
]

const FULL_WIDTH_PAGES = [
  '/templates',
  '/ats-score',
  '/help-center',
  '/contact-us',
  '/privacy-policy',
]

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname()
  const showNavigation = PAGES_WITH_NAVIGATION.includes(pathname)
  const isFullWidth = FULL_WIDTH_PAGES.includes(pathname)

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason)
      event.preventDefault()
    }

    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error)
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }, [])

  const getMainClassName = () => {
    if (!showNavigation) return 'flex-1 w-full p-0'
    if (isFullWidth) return 'flex-1 w-full bg-white'
    return 'flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 bg-white'
  }

  return (
    <AuthProvider>
      {showNavigation && <Navigation />}
      <main className={getMainClassName()}>{children}</main>
    </AuthProvider>
  )
}