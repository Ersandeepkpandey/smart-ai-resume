import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

interface TopTemplate {
  id: string
  name: string
  usage_count: number
  category: string
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

    // Get templates with usage count (based on how many resumes use each template)
    const { data: templates, error } = await supabase
      .from('templates')
      .select(`
        id,
        name,
        category,
        resumes!inner(id)
      `)
      .order('name')

    if (error) {
      console.error('Error fetching templates:', error)
      return NextResponse.json({
        error: 'Failed to fetch templates',
        templates: []
      }, { status: 500 })
    }

    // Count usage for each template
    const templateUsage: { [key: string]: TopTemplate } = {}

    if (templates) {
      templates.forEach((template: any) => {
        const templateId = template.id
        if (!templateUsage[templateId]) {
          templateUsage[templateId] = {
            id: templateId,
            name: template.name,
            usage_count: 0,
            category: template.category
          }
        }
        templateUsage[templateId].usage_count += template.resumes?.length || 0
      })
    }

    // Convert to array and sort by usage count
    const topTemplates = Object.values(templateUsage)
      .sort((a, b) => b.usage_count - a.usage_count)
      .slice(0, 10)

    return NextResponse.json({
      templates: topTemplates
    })
  } catch (error) {
    console.error('Error fetching top templates:', error)
    return NextResponse.json({
      error: 'Internal server error',
      templates: []
    }, { status: 500 })
  }
}