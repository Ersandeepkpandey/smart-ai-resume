'use client'

import { ExternalLink, Copy, Check } from 'lucide-react'
import { useState } from 'react'

export default function SetupGuide() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Rezume! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            To get started, you need to configure Supabase for authentication and database storage.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              Step 1: Create a Supabase Project
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">
                supabase.com <ExternalLink className="w-3 h-3 ml-1" />
              </a> and sign up/login</li>
              <li>Create a new project</li>
              <li>Wait for the project to be set up (this may take a few minutes)</li>
            </ol>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-green-900 mb-2">
              Step 2: Get Your API Keys
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-green-800">
              <li>Go to your project dashboard</li>
              <li>Navigate to Settings → API</li>
              <li>Copy the Project URL and anon public key</li>
            </ol>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-purple-900 mb-2">
              Step 3: Update Environment Variables
            </h2>
            <p className="text-purple-800 mb-3">
              Update your <code className="bg-purple-100 px-2 py-1 rounded text-sm">.env.local</code> file with your Supabase credentials:
            </p>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              <div className="flex items-center justify-between mb-2">
                <span>NEXT_PUBLIC_SUPABASE_URL=your_project_url</span>
                <button
                  onClick={() => copyToClipboard('NEXT_PUBLIC_SUPABASE_URL=your_project_url')}
                  className="text-gray-400 hover:text-white"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key</span>
                <button
                  onClick={() => copyToClipboard('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key')}
                  className="text-gray-400 hover:text-white"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-yellow-900 mb-2">
              Step 4: Set Up Database Tables
            </h2>
            <p className="text-yellow-800 mb-3">
              Run the following SQL in your Supabase SQL Editor:
            </p>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{`-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resumes table
CREATE TABLE resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  template_id TEXT NOT NULL,
  content JSONB NOT NULL,
  ats_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own resumes" ON resumes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes" ON resumes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes" ON resumes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes" ON resumes
  FOR DELETE USING (auth.uid() = user_id);`}</pre>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-indigo-900 mb-2">
              Step 5: Restart Your Development Server
            </h2>
            <p className="text-indigo-800">
              After updating the environment variables, restart your development server:
            </p>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mt-2">
              npm run dev
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Need help? Check out the{' '}
            <a href="https://supabase.com/docs" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Supabase documentation
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}