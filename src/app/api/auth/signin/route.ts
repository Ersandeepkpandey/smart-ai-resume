import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import client from '@/lib/turso'
import { createSession, setSessionCookie } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user
    const userResult = await client.execute({
      sql: `
        SELECT id, email, full_name, password_hash, role, status, is_verified
        FROM users
        WHERE email = ?
      `,
      args: [email]
    })

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const user = userResult.rows[0] as unknown as {
      id: string;
      email: string;
      full_name: string;
      password_hash: string;
      role: string;
      status: string;
      is_verified: boolean;
    }

    // Check if user is active
    if (user.status !== 'active') {
      return NextResponse.json(
        { error: 'Account is not active. Please contact support.' },
        { status: 401 }
      )
    }

    // Check if user is verified (only if SendGrid is configured)
    const sendGridConfigured = !!(process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL)

    if (sendGridConfigured && !user.is_verified) {
      return NextResponse.json(
        { error: 'Please verify your email before signing in' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Update last login
    await client.execute({
      sql: 'UPDATE users SET last_login = datetime("now") WHERE id = ?',
      args: [user.id]
    })

    // Update profile last login
    await client.execute({
      sql: 'UPDATE profiles SET last_login = datetime("now") WHERE id = ?',
      args: [user.id]
    })

    // Create session and set cookie
    const { sessionId } = await createSession(user.id)
    await setSessionCookie(sessionId)

    // Get profile data
    const profileResult = await client.execute({
      sql: 'SELECT * FROM profiles WHERE id = ?',
      args: [user.id]
    })

    const profile = profileResult.rows[0] as unknown as {
      id: string;
      email: string;
      full_name: string;
      avatar_url?: string;
      role: string;
      status: string;
      last_login?: string;
      created_at: string;
      updated_at: string;
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        status: user.status,
        isVerified: user.is_verified,
        profile: {
          id: profile.id,
          email: profile.email,
          fullName: profile.full_name,
          avatarUrl: profile.avatar_url,
          role: profile.role,
          status: profile.status,
          lastLogin: profile.last_login,
          createdAt: profile.created_at,
          updatedAt: profile.updated_at
        }
      }
    })

  } catch (error: unknown) {
    console.error('Signin error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}