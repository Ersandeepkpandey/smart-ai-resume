import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './session';

export async function isAdmin(req: NextRequest): Promise<boolean> {
  try {
    // First check headers set by middleware
    const role = req.headers.get('x-user-role');
    if (role === 'admin') {
      return true;
    }
    
    // Fallback to checking session directly
    const sessionId = req.cookies.get('sessionId')?.value;
    if (!sessionId) return false;
    
    const session = await getSession(sessionId);
    return session?.role === 'admin';
  } catch (error) {
    console.error('Admin check error:', error);
    return false;
  }
}

export async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
  const adminStatus = await isAdmin(req);
  if (!adminStatus) {
    return NextResponse.json(
      { error: 'Access denied. Admin privileges required.' },
      { status: 403 }
    );
  }
  return null; // null means admin check passed
}