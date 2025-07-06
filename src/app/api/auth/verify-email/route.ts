import { NextRequest, NextResponse } from 'next/server'
import client from '@/lib/turso'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

        // Find user by verification token
    const userResult = await client.execute({
      sql: 'SELECT id, email, verification_token, created_at FROM users WHERE verification_token = ?',
      args: [token]
    })

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    const user = userResult.rows[0] as unknown as {
      id: string;
      email: string;
      verification_token: string | null;
      created_at: string;
    }

    // Check if token is expired (24 hours)
    const tokenCreatedAt = new Date(user.created_at)
    const now = new Date()
    const hoursDiff = (now.getTime() - tokenCreatedAt.getTime()) / (1000 * 60 * 60)

    if (hoursDiff > 24) {
      return NextResponse.json(
        { error: 'Verification token has expired' },
        { status: 400 }
      )
    }

    // Check if already verified
    if (user.verification_token === null) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      )
    }

    // Update user to verified
    await client.execute({
      sql: `
        UPDATE users
        SET is_verified = 1, verification_token = NULL, status = 'active'
        WHERE id = ?
      `,
      args: [user.id]
    })

    // Update profile status
    await client.execute({
      sql: 'UPDATE profiles SET status = "active" WHERE id = ?',
      args: [user.id]
    })

    // Redirect to signin page with success message
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/signin?verified=true`

    return NextResponse.redirect(redirectUrl)

  } catch (error: unknown) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}