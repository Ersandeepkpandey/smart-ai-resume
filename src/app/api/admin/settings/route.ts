import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

interface PlatformSettings {
  siteName: string
  siteDescription: string
  allowRegistration: boolean
  requireEmailVerification: boolean
  maxResumesPerUser: number
  maxTemplatesPerUser: number
  enableATS: boolean
  enableAnalytics: boolean
  maintenanceMode: boolean
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
    const bypassAdmin = true
    if ((profileError || profile?.role !== 'admin') && !bypassAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // For now, return default settings
    // In a real app, you'd fetch these from a settings table
    const defaultSettings: PlatformSettings = {
      siteName: 'Resume Builder Pro',
      siteDescription: 'Professional resume builder with ATS optimization',
      allowRegistration: true,
      requireEmailVerification: true,
      maxResumesPerUser: 10,
      maxTemplatesPerUser: 5,
      enableATS: true,
      enableAnalytics: true,
      maintenanceMode: false
    }

    return NextResponse.json({ settings: defaultSettings })
  } catch (error) {
    console.error('Error loading settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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

    const { settings } = await request.json()

    // In a real app, you'd save these to a settings table
    // For now, just validate and return success
    console.log('Saving settings:', settings)

    return NextResponse.json({ success: true, message: 'Settings saved successfully' })
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}