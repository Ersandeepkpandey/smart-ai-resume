import { NextResponse } from 'next/server'
import { getSessionIdFromCookie, clearSessionCookie, deleteSession } from '@/lib/session'

export async function POST() {
  try {
    const sessionId = await getSessionIdFromCookie()

    if (sessionId) {
      // Delete session from database
      await deleteSession(sessionId)
    }

    // Clear session cookie
    await clearSessionCookie()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Signout error:', error)
    // Still clear the cookie even if database operation fails
    await clearSessionCookie()
    return NextResponse.json({ success: true })
  }
}