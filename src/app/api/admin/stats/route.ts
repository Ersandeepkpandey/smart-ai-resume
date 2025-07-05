import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
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
    const bypassAdmin = true // Set to true to bypass admin check

    if ((profileError || profile?.role !== 'admin') && !bypassAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get current date for this month calculations
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    // Fetch statistics
    const [
      { count: totalUsers },
      { count: totalResumes },
      { count: totalTemplates },
      { count: activeUsers },
      { count: resumesThisMonth },
      { count: templatesThisMonth }
    ] = await Promise.all([
      // Total users
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true }),

      // Total resumes
      supabase
        .from('resumes')
        .select('*', { count: 'exact', head: true }),

      // Total templates
      supabase
        .from('templates')
        .select('*', { count: 'exact', head: true }),

      // Active users (users who logged in within last 30 days)
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('last_login', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),

      // Resumes created this month
      supabase
        .from('resumes')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString())
        .lte('created_at', endOfMonth.toISOString()),

      // Templates created this month
      supabase
        .from('templates')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString())
        .lte('created_at', endOfMonth.toISOString())
    ])

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      totalResumes: totalResumes || 0,
      totalTemplates: totalTemplates || 0,
      activeUsers: activeUsers || 0,
      resumesThisMonth: resumesThisMonth || 0,
      templatesThisMonth: templatesThisMonth || 0
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({
      error: 'Internal server error',
      totalUsers: 0,
      totalResumes: 0,
      totalTemplates: 0,
      activeUsers: 0,
      resumesThisMonth: 0,
      templatesThisMonth: 0
    }, { status: 500 })
  }
}