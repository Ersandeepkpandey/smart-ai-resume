import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import client from '@/lib/turso'

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json()

    // Validate input
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await client.execute({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: [email]
    })

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      )
    }

    // Hash password
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Create user (auto-verified for testing)
    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    await client.execute({
      sql: `
        INSERT INTO users (id, email, full_name, password_hash, role, status, is_verified)
        VALUES (?, ?, ?, ?, 'user', 'active', 1)
      `,
      args: [userId, email, fullName, passwordHash]
    })

    // Create profile
    await client.execute({
      sql: `
        INSERT INTO profiles (id, email, full_name, role, status)
        VALUES (?, ?, ?, 'user', 'active')
      `,
      args: [userId, email, fullName]
    })

    return NextResponse.json(
      {
        message: 'User created successfully! You can now sign in.',
        userId
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}