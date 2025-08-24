import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/turso';
import { requireAdmin } from '@/lib/admin-auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireAdmin(req);
    
    
    await client.execute({
      sql: 'DELETE FROM resumes WHERE id = ?',
      args: [id]
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete resume error:', error);
    return NextResponse.json(
      { error: 'Failed to delete resume' },
      { status: 500 }
    );
  }
}