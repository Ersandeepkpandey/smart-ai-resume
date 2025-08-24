import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/turso';
import { requireAdmin } from '@/lib/admin-auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireAdmin(req);
    
    const { role } = await req.json();
    
    await client.execute({
      sql: 'UPDATE users SET role = ? WHERE id = ?',
      args: [role, id]
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireAdmin(req);
    
    
    // Delete user's resumes first
    await client.execute({
      sql: 'DELETE FROM resumes WHERE user_id = ?',
      args: [id]
    });
    
    // Delete user's sessions
    await client.execute({
      sql: 'DELETE FROM sessions WHERE user_id = ?',
      args: [id]
    });
    
    // Delete user
    await client.execute({
      sql: 'DELETE FROM users WHERE id = ?',
      args: [id]
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}