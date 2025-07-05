'use client'

import { useState, useEffect } from 'react'
import { supabase, isSupabaseAvailable } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import CustomSignUp from '@/components/CustomSignUp'

export default function SignUp() {
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  if (!origin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-500">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-2 mb-4">
            <button
              className="w-full flex items-center justify-center border rounded px-4 py-2 bg-gray-100 text-gray-400 cursor-not-allowed"
              disabled
              title="Coming Soon"
            >
              <img src="/google.svg" alt="Google" className="w-5 h-5 mr-2" />
              Sign up with Google (Coming Soon)
            </button>
            <button
              className="w-full flex items-center justify-center border rounded px-4 py-2 bg-gray-100 text-gray-400 cursor-not-allowed"
              disabled
              title="Coming Soon"
            >
              <img src="/linkedin.svg" alt="LinkedIn" className="w-5 h-5 mr-2" />
              Sign up with LinkedIn (Coming Soon)
            </button>
          </div>
          {isSupabaseAvailable() ? (
            <CustomSignUp redirectTo={`${origin}/dashboard`} />
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading authentication...</p>
              <p className="text-sm text-red-600 mt-2">Make sure your Supabase credentials are configured in .env.local</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}