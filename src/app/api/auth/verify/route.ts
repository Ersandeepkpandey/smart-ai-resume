import { NextResponse } from 'next/server'
import client from '@/lib/turso'
import { getSessionIdFromCookie } from '@/lib/session'
import { verifyUserSession } from '@/lib/auth'

export async function GET() {
  try {
    const sessionId = await getSessionIdFromCookie()

    if (!sessionId) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      )
    }

    const sessionUser = await verifyUserSession(sessionId)
    if (!sessionUser) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }

    // Get user data from database
    const userResult = await client.execute({
      sql: `
        SELECT id, email, full_name, role, status, is_verified
        FROM users
        WHERE id = ?
      `,
      args: [sessionUser.userId]
    })

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const user = userResult.rows[0] as unknown as {
      id: string
      email: string
      full_name: string
      role: string
      status: string
      is_verified: boolean
    }

    // Get profile data
    const profileResult = await client.execute({
      sql: 'SELECT * FROM profiles WHERE id = ?',
      args: [user.id]
    })

    const profile = profileResult.rows[0] as unknown as {
      id: string
      email: string
      full_name: string
      avatar_url?: string
      role: string
      status: string
      last_login?: string
      created_at: string
      updated_at: string
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

  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}