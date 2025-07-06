'use client'

import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { LogOut, User, FileText, ChevronDown, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

// Function to generate consistent color based on email
const generateUserColor = (email: string): string => {
  const colors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#96CEB4', // Green
    '#FFEAA7', // Yellow
    '#DDA0DD', // Plum
    '#98D8C8', // Mint
    '#F7DC6F', // Gold
    '#BB8FCE', // Purple
    '#85C1E9', // Light Blue
    '#F8C471', // Orange
    '#82E0AA', // Light Green
    '#F1948A', // Salmon
    '#85C1E9', // Sky Blue
    '#F7DC6F', // Yellow
    '#D7BDE2', // Lavender
  ]

  // Create a hash from the email
  let hash = 0
  for (let i = 0; i < email.length; i++) {
    const char = email.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }

  // Use the hash to select a color
  const index = Math.abs(hash) % colors.length
  return colors[index]
}

export default function Navigation() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <nav className="bg-white/90 backdrop-blur shadow-sm border-b border-gray-200 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-extrabold tracking-tight text-blue-600 hover:text-blue-700 transition-colors">
              Rezume
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="flex items-center text-gray-600 hover:text-blue-600 px-3 py-2 text-base font-medium rounded transition-colors"
            >
              <FileText className="w-5 h-5 mr-2" />
              {user ? 'My Resumes' : 'Demo'}
            </Link>
            <Link
              href="/resume/new"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg text-base font-semibold shadow hover:from-blue-700 hover:to-indigo-700 transition-colors"
            >
              Create Resume
            </Link>
            {user && (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center text-gray-700 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200"
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shadow"
                    style={{ backgroundColor: generateUserColor(user.email || 'default@user.com') }}
                  >
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <ChevronDown className={`w-5 h-5 ml-1 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl py-1 z-50 border border-gray-200 animate-fade-in">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">Signed in as</p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded"
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Profile Settings
                      </Link>
                    </div>

                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}