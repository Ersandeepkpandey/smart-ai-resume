import { cookies } from 'next/headers'
import client from './turso'

const SESSION_COOKIE_NAME = 'session_id'
const SESSION_DURATION_HOURS = 24

// Add a function to generate a random hex string using Web Crypto API
function generateRandomHex(bytes: number) {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

export async function createSession(userId: string) {
  const sessionId = generateRandomHex(32)
  const expiresAt = new Date(Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000).toISOString()
  await client.execute({
    sql: 'INSERT INTO sessions (session_id, user_id, expires_at) VALUES (?, ?, ?)',
    args: [sessionId, userId, expiresAt]
  })
  return { sessionId, expiresAt }
}

export async function getSession(sessionId: string) {
  const result = await client.execute({
    sql: `
      SELECT 
        s.*,
        u.role,
        u.email,
        u.full_name
      FROM sessions s
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.session_id = ? 
      AND s.expires_at > datetime("now")
    `,
    args: [sessionId]
  })
  return result.rows[0] || null
}

export async function deleteSession(sessionId: string) {
  await client.execute({
    sql: 'DELETE FROM sessions WHERE session_id = ?',
    args: [sessionId]
  })
}

export async function setSessionCookie(sessionId: string) {
  const cookieStore = await cookies()
  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: sessionId,
    httpOnly: true,
    path: '/',
    maxAge: SESSION_DURATION_HOURS * 60 * 60,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0,
    expires: new Date(0),
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
}

export async function getSessionIdFromCookie() {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE_NAME)?.value || null
}