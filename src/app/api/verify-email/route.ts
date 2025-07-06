import { NextRequest, NextResponse } from 'next/server'
import client from '@/lib/turso'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.json({ error: 'Missing token.' }, { status: 400 })
  }

  try {
    // Find user by token
    const result = await client.execute({
      sql: 'SELECT id FROM users WHERE verification_token = ?',
      args: [token]
    })

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 400 })
    }

    // Mark as verified and clear token
    await client.execute({
      sql: 'UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE verification_token = ?',
      args: [token]
    })

    // Redirect to sign-in with verified message
    return NextResponse.redirect('/auth/signin?verified=1', { status: 302 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Verification failed.' }, { status: 500 })
  }
}