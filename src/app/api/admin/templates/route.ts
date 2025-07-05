import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    console.log('Templates API endpoint called')

    const supabase = createServerClient({ cookies: () => cookies() })
    console.log('Supabase client created')

    // TEMPORARY: Skip auth for debugging
    console.log('Skipping auth check for debugging...')

        // Fetch all templates directly
    console.log('Attempting to fetch templates...')

    // First, let's create some sample templates if none exist
    const { data: existingTemplates, error: checkError } = await supabase
      .from('templates')
      .select('count')
      .limit(1)

    console.log('Existing templates check:', { existingTemplates, checkError })

    if (!existingTemplates || existingTemplates.length === 0) {
      console.log('No templates found, creating sample templates...')

      const sampleTemplates = [
        {
          name: 'Professional Classic',
          description: 'A clean, professional template suitable for corporate environments',
          category: 'professional',
          status: 'active',
          html_content: '<div class="resume">Professional template content</div>',
          css_styles: '.resume { font-family: Arial, sans-serif; }',
          usage_count: 0
        },
        {
          name: 'Modern Creative',
          description: 'A modern, creative template with bold design elements',
          category: 'creative',
          status: 'active',
          html_content: '<div class="resume-modern">Modern template content</div>',
          css_styles: '.resume-modern { font-family: "Helvetica Neue", sans-serif; }',
          usage_count: 0
        },
        {
          name: 'Minimalist',
          description: 'A clean, minimalist template focusing on content',
          category: 'modern',
          status: 'active',
          html_content: '<div class="resume-minimal">Minimalist template content</div>',
          css_styles: '.resume-minimal { font-family: "Open Sans", sans-serif; }',
          usage_count: 0
        }
      ]

      const { data: insertedTemplates, error: insertError } = await supabase
        .from('templates')
        .insert(sampleTemplates)
        .select()

      console.log('Sample templates created:', { insertedTemplates, insertError })
    }

    // Now fetch all templates
    const { data: templates, error: templatesError } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false })

    console.log('Templates response:', { templates, templatesError })

    if (templatesError) {
      console.error('Templates error:', templatesError)
      return NextResponse.json({
        error: 'Failed to fetch templates',
        details: templatesError.message,
        templates: []
      }, { status: 500 })
    }

    console.log('Returning templates:', templates?.length || 0)
    return NextResponse.json({ templates: templates || [] })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json({ error: 'Internal server error', templates: [] }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient({ cookies: () => cookies() })
    // TEMPORARY: Skip auth for debugging

    const body = await request.json()
    const {
      name,
      description = '',
      category = 'professional',
      status = 'draft',
      html_content = '',
      css_styles = '',
      preview_image = null,
      usage_count = 0
    } = body

    if (!name || !html_content) {
      return NextResponse.json({ error: 'Name and HTML content are required.' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('templates')
      .insert([
        {
          name,
          description,
          category,
          status,
          html_content,
          css_styles,
          preview_image,
          usage_count
        }
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to create template', details: error.message }, { status: 500 })
    }

    return NextResponse.json({ template: data })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerClient({ cookies: () => cookies() })
    // TEMPORARY: Skip auth for debugging

    const body = await request.json()
    const {
      name,
      description = '',
      category = 'professional',
      status = 'draft',
      html_content = '',
      css_styles = '',
      preview_image = null,
      usage_count = 0
    } = body

    if (!name || !html_content) {
      return NextResponse.json({ error: 'Name and HTML content are required.' }, { status: 400 })
    }

    // Get the template ID from the URL
    const url = new URL(request.url)
    const pathParts = url.pathname.split('/')
    const templateId = pathParts[pathParts.length - 1]

    const { data, error } = await supabase
      .from('templates')
      .update({
        name,
        description,
        category,
        status,
        html_content,
        css_styles,
        preview_image,
        usage_count
      })
      .eq('id', templateId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to update template', details: error.message }, { status: 500 })
    }

    return NextResponse.json({ template: data })
  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}