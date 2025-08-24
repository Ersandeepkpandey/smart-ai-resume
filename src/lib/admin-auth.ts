import { NextRequest } from 'next/server';
import { getSession } from './session';

export async function isAdmin(req: NextRequest): Promise<boolean> {
  try {
    const sessionId = req.cookies.get('sessionId')?.value;
    if (!sessionId) return false;
    
    const session = await getSession(sessionId);
    return session?.role === 'admin';
  } catch (error) {
    console.error('Admin check error:', error);
    return false;
  }
}

export async function requireAdmin(req: NextRequest) {
  const adminStatus = await isAdmin(req);
  if (!adminStatus) {
    return false;
  }
  return true;
}