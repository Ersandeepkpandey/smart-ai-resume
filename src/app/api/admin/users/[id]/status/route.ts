import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { status } = await request.json()

    // Update user status
    const { error } = await supabase
      .from('profiles')
      .update({ status })
      .eq('id', params.id)

    if (error) {
      console.error('Error updating user status:', error)
      return NextResponse.json({
        error: 'Failed to update user status'
      }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating user status:', error)
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
}