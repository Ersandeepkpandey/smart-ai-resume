import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/turso';
import bcrypt from 'bcryptjs';

// POST - Create first admin user (only works if no admin exists)
export async function POST(req: NextRequest) {
  try {
    // Check if any admin user already exists
    const adminCheckResult = await client.execute({
      sql: "SELECT COUNT(*) as count FROM users WHERE role = 'admin'",
      args: []
    });
    
    const adminCount = Number(adminCheckResult.rows[0].count);
    
    if (adminCount > 0) {
      return NextResponse.json(
        { error: 'Admin user already exists. This endpoint can only be used for initial setup.' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const body = await req.json();
    const { email, password, fullName } = body;
    
    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Check if user with this email already exists
    const existingUserResult = await client.execute({
      sql: 'SELECT id, role FROM users WHERE email = ?',
      args: [email]
    });
    
    if (existingUserResult.rows.length > 0) {
      const existingUser = existingUserResult.rows[0];
      
      // If user exists but is not admin, upgrade them to admin
      if (existingUser.role !== 'admin') {
        await client.execute({
          sql: "UPDATE users SET role = 'admin', updated_at = datetime('now') WHERE id = ?",
          args: [existingUser.id]
        });
        
        return NextResponse.json({
          message: 'Existing user upgraded to admin successfully',
          email,
          role: 'admin'
        });
      }
      
      return NextResponse.json(
        { error: 'User with this email already exists as admin' },
        { status: 409 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new admin user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await client.execute({
      sql: `
        INSERT INTO users (
          id, 
          email, 
          password, 
          full_name, 
          role, 
          status, 
          is_verified,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, 'admin', 'active', 1, datetime('now'), datetime('now'))
      `,
      args: [userId, email, hashedPassword, fullName || 'Admin User']
    });
    
    console.log(`First admin user created successfully: ${email}`);
    
    return NextResponse.json({
      message: 'Admin user created successfully',
      email,
      role: 'admin',
      note: 'Please sign in with your credentials at /auth/signin'
    });
    
  } catch (error) {
    console.error('Admin setup error:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}

// GET - Check if admin setup is needed
export async function GET() {
  try {
    const adminCheckResult = await client.execute({
      sql: "SELECT COUNT(*) as count FROM users WHERE role = 'admin'",
      args: []
    });
    
    const adminCount = Number(adminCheckResult.rows[0].count);
    
    return NextResponse.json({
      setupRequired: adminCount === 0,
      adminExists: adminCount > 0,
      message: adminCount === 0 
        ? 'No admin user exists. Use POST to create the first admin.' 
        : 'Admin user already exists.'
    });
    
  } catch (error) {
    console.error('Admin setup check error:', error);
    return NextResponse.json(
      { error: 'Failed to check admin status' },
      { status: 500 }
    );
  }
}