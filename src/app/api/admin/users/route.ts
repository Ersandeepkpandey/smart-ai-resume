import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

interface User {
  id: string
  email: string
  full_name: string | null
  role: 'user' | 'admin' | 'moderator'
  status: 'active' | 'suspended' | 'pending'
  created_at: string
  last_login: string | null
  resume_count: number
}

export async function GET(request: NextRequest) {
  try {
    console.log('API endpoint called')

    // Check if Supabase is properly configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey || !supabaseUrl.includes('supabase.co')) {
      console.error('Supabase not properly configured')
      return NextResponse.json({
        error: 'Supabase configuration is missing or invalid. Please check your environment variables.',
        users: []
      }, { status: 500 })
    }

    console.log('Supabase URL:', supabaseUrl)
    console.log('Supabase key available:', !!supabaseAnonKey)

    const supabase = createServerClient({ cookies: () => cookies() })
    console.log('Supabase client created')

    // TEMPORARY: Skip all auth checks for debugging
    console.log('Skipping auth checks for debugging...')

    // Try to fetch users directly
    console.log('Attempting to fetch users...')

    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('*')

    console.log('Supabase response:', { users, usersError })

    if (usersError) {
      console.error('Error fetching users:', usersError)
      return NextResponse.json({
        error: 'Failed to fetch users',
        details: usersError?.message || 'Unknown error',
        users: []
      }, { status: 500 })
    }

    console.log('Raw users data:', users)

    if (!users || users.length === 0) {
      console.log('No users found')
      return NextResponse.json([])
    }

    // Simple processing without resume counts for now
    const processedUsers = users.map((user: any) => ({
      id: user.id,
      email: user.email || 'No email',
      full_name: user.full_name || null,
      role: user.role || 'user',
      status: user.status || 'active',
      created_at: user.created_at,
      last_login: user.last_login || null,
      resume_count: 0 // We'll add this back later
    }))

    console.log('Processed users:', processedUsers)

    return NextResponse.json(processedUsers)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({
      error: 'Internal server error',
      users: []
    }, { status: 500 })
  }
}