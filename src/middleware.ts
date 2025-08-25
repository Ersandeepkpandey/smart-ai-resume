import { NextRequest, NextResponse } from 'next/server'
import { getSessionIdFromCookie } from '@/lib/session'
import { verifyUserSession } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public paths that don't require authentication
  const publicPaths = [
    '/auth/signin',
    '/auth/signup',
    '/resume/new',
    '/api/auth/signin',
    '/api/auth/signup',
    '/api/auth/verify-email',
    '/api/auth/verify',  // Allow auth verification
    '/api/debug-env',
    '/api/debug-db',
    '/admin/setup',  // Allow access to admin setup page
    '/api/admin/setup',  // Allow access to admin setup API
    '/about',
    '/contact-us',
    '/privacy-policy',
    '/terms',
    '/disclaimer',
    '/blog',
    '/careers',
    '/help-center',
    '/templates',
    '/ats-score',
    '/api/contact'  // Allow contact form submission without auth
  ]

  // Special case: allow /admin (login page) but not /admin/* routes
  const isAdminLoginPage = pathname === '/admin'

  // Admin paths that require admin role (excluding setup)
  const adminPaths = [
    '/admin',
    '/api/admin'
  ]
  
  // Exclude setup paths from admin check
  const isSetupPath = pathname.startsWith('/admin/setup') || pathname.startsWith('/api/admin/setup')

  // Check if the current path is public
  const isPublicPath = pathname === '/' || isAdminLoginPage || publicPaths.some(path => pathname.startsWith(path))
  
  // Check if the current path is an admin path (excluding the login page)
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path)) && !isAdminLoginPage

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

    // Check admin access for admin paths (but not setup paths)
    if (isAdminPath && !isSetupPath) {
      // Check if user has admin role
      if (user.role !== 'admin') {
        console.log(`Access denied: User ${user.email} (role: ${user.role}) attempted to access admin path: ${pathname}`)
        
        if (pathname.startsWith('/api/')) {
          return NextResponse.json({ 
            error: 'Access denied. Admin privileges required.' 
          }, { status: 403 })
        }
        
        // Redirect non-admin users to home page with access denied message
        const redirectUrl = new URL('/', request.url)
        redirectUrl.searchParams.set('error', 'admin_access_denied')
        return NextResponse.redirect(redirectUrl)
      }
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
  } catch {
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
     * - Static assets (.png, .jpg, .jpeg, .gif, .svg, .ico, .webp)
     * - robots.txt, sitemap.xml
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$|robots.txt|sitemap.xml).*)',
  ],
}