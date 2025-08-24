import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/turso';

// GET - Fetch specific template by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await client.execute({
      sql: `
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
        WHERE id = ?
      `,
      args: [id]
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    const template = {
      id: result.rows[0].id as string,
      name: result.rows[0].name as string,
      description: result.rows[0].description as string,
      category: result.rows[0].category as string,
      status: result.rows[0].status as string,
      html_content: result.rows[0].html_content as string,
      css_styles: result.rows[0].css_styles as string,
      preview_image: result.rows[0].preview_image as string,
      usage_count: result.rows[0].usage_count as number,
      created_at: result.rows[0].created_at as string,
      updated_at: result.rows[0].updated_at as string
    };

    // Increment usage count
    await client.execute({
      sql: 'UPDATE templates SET usage_count = usage_count + 1 WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({ template });
  } catch (error) {
    console.error('Get template error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    );
  }
}

// PUT - Update template (Admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: Add admin authentication check
    const { id } = await params;
    const body = await req.json();
    const { name, description, category, html_content, css_styles, preview_image, status } = body;

    const result = await client.execute({
      sql: `
        UPDATE templates SET 
          name = COALESCE(?, name),
          description = COALESCE(?, description),
          category = COALESCE(?, category),
          html_content = COALESCE(?, html_content),
          css_styles = COALESCE(?, css_styles),
          preview_image = COALESCE(?, preview_image),
          status = COALESCE(?, status),
          updated_at = datetime('now')
        WHERE id = ?
      `,
      args: [
        name || null,
        description || null,
        category || null,
        html_content || null,
        css_styles || null,
        preview_image || null,
        status || null,
        id
      ]
    });

    if (result.rowsAffected === 0) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Template updated successfully' });
  } catch (error) {
    console.error('Update template error:', error);
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    );
  }
}

// DELETE - Delete template (Admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: Add admin authentication check
    const { id } = await params;
    const result = await client.execute({
      sql: 'DELETE FROM templates WHERE id = ?',
      args: [id]
    });

    if (result.rowsAffected === 0) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Delete template error:', error);
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    );
  }
}