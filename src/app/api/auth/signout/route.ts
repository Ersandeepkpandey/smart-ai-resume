import { NextResponse } from 'next/server'
import { getSessionIdFromCookie, clearSessionCookie, deleteSession } from '@/lib/session'

export async function POST() {
  try {
    const sessionId = await getSessionIdFromCookie()

    // Clear session cookie first
    await clearSessionCookie()

    if (sessionId) {
      // Delete session from database
      await deleteSession(sessionId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Signout error:', error)
    // Still clear the cookie even if database operation fails
    try {
    await clearSessionCookie()
    } catch (clearError) {
      console.error('Failed to clear session cookie:', clearError)
    }
    return NextResponse.json({ success: true })
  }
}