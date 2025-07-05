import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Duplicating template with ID:', params.id)

    const supabase = createServerClient({ cookies: () => cookies() })
    // TEMPORARY: Skip auth for debugging

    // First, get the original template
    const { data: originalTemplate, error: fetchError } = await supabase
      .from('templates')
      .select('*')
      .eq('id', params.id)
      .single()

    if (fetchError) {
      console.error('Error fetching original template:', fetchError)
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Create a duplicate with modified name
    const { id, created_at, updated_at, ...templateData } = originalTemplate
    const duplicateData = {
      ...templateData,
      name: `${originalTemplate.name} (Copy)`,
      status: 'draft', // Set to draft by default
      usage_count: 0 // Reset usage count
    }

    const { data: duplicatedTemplate, error: insertError } = await supabase
      .from('templates')
      .insert([duplicateData])
      .select()
      .single()

    if (insertError) {
      console.error('Error duplicating template:', insertError)
      return NextResponse.json({ error: 'Failed to duplicate template', details: insertError.message }, { status: 500 })
    }

    console.log('Template duplicated successfully:', duplicatedTemplate)
    return NextResponse.json({ template: duplicatedTemplate })
  } catch (error) {
    console.error('Error duplicating template:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}