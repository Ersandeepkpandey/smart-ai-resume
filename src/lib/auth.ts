import { createSession, getSession, deleteSession } from './session'
import client from './turso'

type UserRole = 'user' | 'admin'

export interface UserPayload {
  userId: string
  email: string
  role: UserRole
}

export async function createUserSession(userId: string, email: string, role: UserRole) {
  const { sessionId } = await createSession(userId)
  return { sessionId, user: { userId, email, role } }
}

export async function verifyUserSession(sessionId: string): Promise<UserPayload | null> {
  const session = await getSession(sessionId)
  if (!session) return null

  // Get user details from database
  const userResult = await client.execute({
    sql: 'SELECT id, email, role FROM users WHERE id = ?',
    args: [session.user_id]
  })

  const user = userResult.rows[0]
  if (!user) return null

  return {
    userId: user.id as string,
    email: user.email as string,
    role: user.role as UserRole
  }
}

export async function destroyUserSession(sessionId: string) {
  await deleteSession(sessionId)
}

export function hashPassword(password: string): Promise<string> {
  const bcrypt = require('bcryptjs')
  return bcrypt.hash(password, 10)
}

export function comparePassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = require('bcryptjs')
  return bcrypt.compare(password, hash)
}