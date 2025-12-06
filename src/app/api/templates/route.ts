import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/turso';

// GET - Fetch all active templates
export async function GET() {
  try {
    const result = await client.execute(`
      SELECT 
        id,
        name,
        description,
        category,
        status,
        html_content,
        css_styles,
        preview_image,
        usage_count,
        created_at,
        updated_at
      FROM templates
      WHERE status = 'active'
      ORDER BY usage_count DESC, created_at DESC
    `);

    const templates = result.rows.map(row => ({
      id: row.id as string,
      name: row.name as string,
      description: row.description as string,
      category: row.category as string,
      status: row.status as string,
      html_content: row.html_content as string,
      css_styles: row.css_styles as string,
      preview_image: row.preview_image as string,
      usage_count: row.usage_count as number,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string
    }));

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Templates API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

// POST - Create new template (Admin only)
export async function POST(req: NextRequest) {
  try {
    // TODO: Add admin authentication check
    const body = await req.json();
    const { name, description, category, html_content, css_styles, preview_image } = body;

    if (!name || !html_content) {
      return NextResponse.json(
        { error: 'Name and HTML content are required' },
        { status: 400 }
      );
    }

    const templateId = `template-${Date.now()}`;
    
    await client.execute({
      sql: `
        INSERT INTO templates (
          id, name, description, category, status, html_content, css_styles, 
          preview_image, usage_count, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        templateId,
        name,
        description || '',
        category || 'professional',
        'active',
        html_content,
        css_styles || '',
        preview_image || '',
        0,
        'admin' // TODO: Get actual admin user ID
      ]
    });

    return NextResponse.json({ 
      id: templateId,
      message: 'Template created successfully' 
    });
  } catch (error) {
    console.error('Create template error:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}