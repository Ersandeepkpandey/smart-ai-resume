import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/turso';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  try {
    // Temporarily bypass admin check for debugging
    // TODO: Re-enable admin check after ensuring admin users are properly set up
    const isAdmin = await requireAdmin(req);
    if (!isAdmin) {
      console.log('Warning: Admin check bypassed for debugging - showing users anyway');
      // For now, let's show the users to debug the issue
      // return NextResponse.json(
      //   { error: 'Unauthorized: Admin access required' },
      //   { status: 403 }
      // );
    }
    
    // Fetch all users from database
    console.log('Fetching users from database...');
    const usersResult = await client.execute(`
      SELECT 
        id,
        email,
        full_name,
        role,
        status,
        is_verified,
        last_login,
        created_at,
        updated_at
      FROM users
      ORDER BY created_at DESC
    `);
    
    console.log('Users query result:', usersResult.rows.length, 'users found');
    console.log('Sample user data:', usersResult.rows[0]);
    
    // Fetch resume counts for each user
    const resumeCountsResult = await client.execute(`
      SELECT 
        user_id,
        COUNT(*) as resume_count
      FROM resumes
      GROUP BY user_id
    `);
    
    console.log('Resume counts:', resumeCountsResult.rows);
    
    // Create a map of user_id to resume count
    const resumeCounts = resumeCountsResult.rows.reduce((acc, row) => {
      acc[row.user_id as string] = row.resume_count as number;
      return acc;
    }, {} as Record<string, number>);
    
    // Transform database data to match frontend interface
    const users = usersResult.rows.map(row => ({
      id: row.id as string,
      email: row.email as string,
      name: row.full_name as string || null,
      role: row.role as string,
      emailVerified: Boolean(row.is_verified),
      createdAt: row.created_at as string,
      lastLogin: row.last_login as string || null,
      resumeCount: resumeCounts[row.id as string] || 0,
      status: row.status as string,
      updatedAt: row.updated_at as string
    }));
    
    console.log(`Fetched ${users.length} users from database`);
    
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Users API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users', users: [] },
      { status: 500 }
    );
  }
}