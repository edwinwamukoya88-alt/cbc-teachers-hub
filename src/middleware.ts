import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = ['/', '/about', '/contact', '/pricing', '/resources', '/blog']
const authPaths = ['/login', '/signup', '/forgot-password']

const protectedPaths = [
  '/dashboard',
  '/teacher',
  '/admin',
  '/lesson-plans',
  '/schemes',
  '/exams',
  '/report-cards',
  '/report-comments',
  '/rubrics',
  '/subscription',
  '/profile',
]

const adminPaths = ['/admin']

interface SessionData {
  uid: string
  role: string
}

function decodeSession(cookieValue: string): SessionData | null {
  try {
    const json = atob(cookieValue)
    return JSON.parse(json) as SessionData
  } catch {
    return null
  }
}

function matchesAny(pathname: string, patterns: string[]): boolean {
  return patterns.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

function getDashboardRouteForRole(role: string): string {
  switch (role) {
    case 'school_admin':
    case 'super_admin':
      return '/admin/dashboard'
    case 'teacher':
      return '/teacher/dashboard'
    default:
      return '/dashboard'
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get('session')?.value
  const session = sessionCookie ? decodeSession(sessionCookie) : null
  const isAuthenticated = !!session

  if (matchesAny(pathname, publicPaths)) {
    return NextResponse.next()
  }

  if (matchesAny(pathname, authPaths)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(getDashboardRouteForRole(session!.role), request.url))
    }
    return NextResponse.next()
  }

  if (!isAuthenticated && matchesAny(pathname, protectedPaths)) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthenticated && matchesAny(pathname, adminPaths)) {
    const allowedRoles = ['super_admin', 'school_admin']
    if (!allowedRoles.includes(session!.role)) {
      return NextResponse.redirect(new URL(getDashboardRouteForRole(session!.role), request.url))
    }
  }

  const response = NextResponse.next()

  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
}
