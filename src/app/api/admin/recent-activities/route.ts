import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

interface Activity {
  id: string
  user_email: string
  action: string
  created_at: string
  resume_title?: string
  template_name?: string
}

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

    // Fetch recent activities from multiple sources
    const activities: Activity[] = []

    // Get recent resume creations
    const { data: recentResumes, error: resumesError } = await supabase
      .from('resumes')
      .select(`
        id,
        title,
        created_at,
        user_id,
        profiles!inner(email)
      `)
      .order('created_at', { ascending: false })
      .limit(20)

    if (!resumesError && recentResumes) {
      recentResumes.forEach((resume: any) => {
        activities.push({
          id: `resume_${resume.id}`,
          user_email: resume.profiles.email,
          action: 'Created resume',
          created_at: resume.created_at,
          resume_title: resume.title
        })
      })
    }

    // Get recent template creations
    const { data: recentTemplates, error: templatesError } = await supabase
      .from('templates')
      .select(`
        id,
        name,
        created_at,
        user_id,
        profiles!inner(email)
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    if (!templatesError && recentTemplates) {
      recentTemplates.forEach((template: any) => {
        activities.push({
          id: `template_${template.id}`,
          user_email: template.profiles.email,
          action: 'Created template',
          created_at: template.created_at,
          template_name: template.name
        })
      })
    }

    // Get recent user registrations
    const { data: recentUsers, error: usersError } = await supabase
      .from('profiles')
      .select('id, email, created_at')
      .order('created_at', { ascending: false })
      .limit(10)

    if (!usersError && recentUsers) {
      recentUsers.forEach(user => {
        activities.push({
          id: `user_${user.id}`,
          user_email: user.email,
          action: 'Registered',
          created_at: user.created_at
        })
      })
    }

    // Sort all activities by created_at and take the most recent 15
    const sortedActivities = activities
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 15)

    return NextResponse.json({
      activities: sortedActivities
    })
  } catch (error) {
    console.error('Error fetching recent activities:', error)
    return NextResponse.json({
      error: 'Internal server error',
      activities: []
    }, { status: 500 })
  }
}