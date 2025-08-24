import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/turso';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  try {
    // Check admin privileges
    const adminCheck = await requireAdmin(req);
    if (adminCheck) return adminCheck;
    
    // Fetch all resumes from database
    const result = await client.execute({
      sql: `
        SELECT 
          r.id,
          r.title,
          r.template_id,
          r.ats_score,
          r.created_at,
          r.updated_at,
          u.email as user_email,
          u.full_name as user_name,
          u.id as user_id
        FROM resumes r
        LEFT JOIN users u ON r.user_id = u.id
        ORDER BY r.created_at DESC
      `
    });
    
    const resumes = result.rows.map(row => ({
      id: row.id as string,
      userId: row.user_id as string || 'unknown',
      userEmail: row.user_email as string || 'unknown@example.com',
      userName: row.user_name as string || 'Unknown User',
      title: row.title as string,
      template: row.template_id as string,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
      completionStatus: row.ats_score as number || 0
    }));
    
    return NextResponse.json({ resumes });
  } catch (error) {
    console.error('Resumes API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch resumes',
      resumes: [] 
    }, { status: 500 });
  }
}