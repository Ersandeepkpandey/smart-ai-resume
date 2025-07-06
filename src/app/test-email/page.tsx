'use client'

import { useState } from 'react'

export default function TestEmail() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const sendTestEmail = async () => {
    if (!email) return

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/auth/send-test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: 'Failed to send test email', details: error })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          SendGrid Email Test
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Test your SendGrid configuration
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={sendTestEmail}
                disabled={loading || !email}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Test Email'}
              </button>
            </div>
          </div>

          {result && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Result:</h3>
              <div className={`p-4 rounded-md ${
                result.success
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Environment Check:</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">SENDGRID_API_KEY:</span>{' '}
                  <span className={process.env.NEXT_PUBLIC_SENDGRID_API_KEY ? 'text-green-600' : 'text-red-600'}>
                    {process.env.NEXT_PUBLIC_SENDGRID_API_KEY ? '✅ Set' : '❌ Not set'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">SENDGRID_FROM_EMAIL:</span>{' '}
                  <span className={process.env.NEXT_PUBLIC_SENDGRID_FROM_EMAIL ? 'text-green-600' : 'text-red-600'}>
                    {process.env.NEXT_PUBLIC_SENDGRID_FROM_EMAIL ? '✅ Set' : '❌ Not set'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}