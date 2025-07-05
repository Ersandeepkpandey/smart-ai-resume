import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const envVars = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?
        `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...` : 'Not set',
      NODE_ENV: process.env.NODE_ENV,
    }

    const hasValidConfig = envVars.NEXT_PUBLIC_SUPABASE_URL &&
                          envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'Not set' &&
                          envVars.NEXT_PUBLIC_SUPABASE_URL.includes('supabase.co')

    return NextResponse.json({
      success: true,
      hasValidConfig,
      envVars,
      message: hasValidConfig ? 'Supabase is properly configured' : 'Supabase configuration is missing or invalid'
    })

  } catch (error) {
    console.error('Debug env error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to check environment variables'
    }, { status: 500 })
  }
}