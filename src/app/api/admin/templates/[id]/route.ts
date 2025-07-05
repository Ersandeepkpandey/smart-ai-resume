import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Fetching template with ID:', params.id)

    const supabase = createServerClient({ cookies: () => cookies() })
    // TEMPORARY: Skip auth for debugging

    const { data: template, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching template:', error)
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    console.log('Template found:', template)
    return NextResponse.json(template)
  } catch (error) {
    console.error('Error fetching template:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Updating template with ID:', params.id)

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
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating template:', error)
      return NextResponse.json({ error: 'Failed to update template', details: error.message }, { status: 500 })
    }

    console.log('Template updated successfully:', data)
    return NextResponse.json({ template: data })
  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Deleting template with ID:', params.id)

    const supabase = createServerClient({ cookies: () => cookies() })
    // TEMPORARY: Skip auth for debugging

    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting template:', error)
      return NextResponse.json({ error: 'Failed to delete template', details: error.message }, { status: 500 })
    }

    console.log('Template deleted successfully')
    return NextResponse.json({ message: 'Template deleted successfully' })
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}