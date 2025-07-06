import { NextRequest, NextResponse } from 'next/server'
import { getSessionIdFromCookie } from '@/lib/session'
import { verifyUserSession } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public paths that don't require authentication
  const publicPaths = [
    '/',
    '/auth/signin',
    '/auth/signup',
    '/api/auth/signin',
    '/api/auth/signup',
    '/api/auth/verify-email',
    '/api/debug-env'
  ]

  // Check if the current path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  if (isPublicPath) {
    return NextResponse.next()
  }

  // Get session ID from cookie
  const sessionId = await getSessionIdFromCookie()

  if (!sessionId) {
    // Redirect to signin if no session
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  try {
    // Verify session
    const user = await verifyUserSession(sessionId)

    if (!user) {
      throw new Error('Invalid session')
    }

    // Add user info to headers for API routes
    if (pathname.startsWith('/api/')) {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', user.userId)
      requestHeaders.set('x-user-role', user.role)
      requestHeaders.set('x-user-email', user.email)

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }

    return NextResponse.next()
  } catch (error) {
    // Invalid session
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}