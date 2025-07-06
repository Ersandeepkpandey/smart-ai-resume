import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import client from '@/lib/turso'
import sgMail from '@sendgrid/mail'

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

    // Check if user already exists in either users or profiles table
    const existingUser = await client.execute({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: [email]
    })

    const existingProfile = await client.execute({
      sql: 'SELECT id FROM profiles WHERE email = ?',
      args: [email]
    })

    if (existingUser.rows.length > 0 || existingProfile.rows.length > 0) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      )
    }

    // Hash password
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Create user
    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    await client.execute({
      sql: `
        INSERT INTO users (id, email, full_name, password_hash, role, status, is_verified)
        VALUES (?, ?, ?, ?, 'user', 'active', 1)
      `,
      args: [userId, email, fullName, passwordHash]
    })

    // Create profile
    try {
      await client.execute({
        sql: `
          INSERT INTO profiles (id, email, full_name, role, status)
          VALUES (?, ?, ?, 'user', 'active')
        `,
        args: [userId, email, fullName]
      })
    } catch (profileError: any) {
      // If profile creation fails, clean up the user and return error
      console.error('Profile creation failed:', profileError)
      await client.execute({
        sql: 'DELETE FROM users WHERE id = ?',
        args: [userId]
      })
      return NextResponse.json(
        { error: 'Failed to create user profile. Please try again.' },
        { status: 500 }
      )
    }

    // Optionally send welcome email (skip verification)
    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL) {
      try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        await sgMail.send({
          to: email,
          from: process.env.SENDGRID_FROM_EMAIL,
          subject: 'Welcome to Resume Maker',
          text: `Welcome, ${fullName}! Your account has been created.`
        })
      } catch (e) {
        // Ignore email errors
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}