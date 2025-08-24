import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/turso';
import { requireAdmin } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    
    const { resumeIds } = await req.json();
    
    if (!resumeIds || !Array.isArray(resumeIds) || resumeIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid resume IDs' },
        { status: 400 }
      );
    }
    
    
    const placeholders = resumeIds.map(() => '?').join(',');
    await client.execute({
      sql: `DELETE FROM resumes WHERE id IN (${placeholders})`,
      args: resumeIds
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Bulk delete resumes error:', error);
    return NextResponse.json(
      { error: 'Failed to delete resumes' },
      { status: 500 }
    );
  }
}