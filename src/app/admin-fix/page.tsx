"use client"

import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import { Shield, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function AdminFixPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const makeAdmin = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/admin/make-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
      } else {
        setError(data.error || 'Failed to make admin')
      }
    } catch (err) {
      setError('An error occurred while making you admin')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">You must be signed in to access this page.</p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-blue-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Access Fix</h2>
          <p className="text-gray-600 mb-6">
            Current user: <strong>{user.email}</strong>
          </p>

          {success ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center text-green-600">
                <CheckCircle className="w-8 h-8 mr-2" />
                <span className="text-lg font-medium">Success!</span>
              </div>
              <p className="text-green-700">
                You are now an admin. You can access the admin panel.
              </p>
              <Link
                href="/admin"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Go to Admin Panel
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          ) : error ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center text-red-600">
                <AlertCircle className="w-8 h-8 mr-2" />
                <span className="text-lg font-medium">Error</span>
              </div>
              <p className="text-red-700">{error}</p>
              <button
                onClick={makeAdmin}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Try Again'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">
                Click the button below to make yourself an admin and gain access to the admin panel.
              </p>
              <button
                onClick={makeAdmin}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Make Me Admin'}
              </button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}