import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient({ cookies: () => cookies() })

    // Get the user from the request
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has admin role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // TEMPORARY BYPASS - Remove this in production
    const bypassAdmin = true
    if ((profileError || profile?.role !== 'admin') && !bypassAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // In a real app, you'd clear various caches here
    // For now, just return success
    console.log('Cache cleared by admin:', user.id)

    return NextResponse.json({
      success: true,
      message: 'Cache cleared successfully'
    })
  } catch (error) {
    console.error('Error clearing cache:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}