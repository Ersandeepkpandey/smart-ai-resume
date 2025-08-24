import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/turso';
import { requireAdmin } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    
    const { userIds } = await req.json();
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid user IDs' },
        { status: 400 }
      );
    }
    
    
    // Delete users' resumes
    const placeholders = userIds.map(() => '?').join(',');
    await client.execute({
      sql: `DELETE FROM resumes WHERE user_id IN (${placeholders})`,
      args: userIds
    });
    
    // Delete users' sessions
    await client.execute({
      sql: `DELETE FROM sessions WHERE user_id IN (${placeholders})`,
      args: userIds
    });
    
    // Delete users
    await client.execute({
      sql: `DELETE FROM users WHERE id IN (${placeholders})`,
      args: userIds
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Bulk delete users error:', error);
    return NextResponse.json(
      { error: 'Failed to delete users' },
      { status: 500 }
    );
  }
}