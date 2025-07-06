'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import CustomSignIn from '@/components/CustomSignIn'
import { useSearchParams } from 'next/navigation'

export default function SignIn() {
  const [origin, setOrigin] = useState('')
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const registered = searchParams.get('registered')
  const verified = searchParams.get('verified')

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
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
            create a new account
          </Link>
        </p>
        {registered && (
          <div className="mt-4 p-3 bg-blue-100 border border-blue-300 text-blue-800 rounded text-center">
            Registration successful! Please verify your email and then log in.
          </div>
        )}
        {verified && (
          <div className="mt-4 p-3 bg-green-100 border border-green-300 text-green-800 rounded text-center">
            Email verified successfully. You can now log in.
          </div>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mt-6">
            <CustomSignIn redirectTo={`${origin}/dashboard`} />
          </div>
        </div>
      </div>
    </div>
  )
}