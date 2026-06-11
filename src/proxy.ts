import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = [
  '/', '/about', '/contact', '/pricing', '/resources', '/blog',
]
const authPaths = ['/login', '/signup', '/forgot-password']
const adminPaths = ['/admin']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = request.cookies.get('session')?.value

  const isPublic = publicPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  const isAuth = authPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  const isAdmin = adminPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  const isDashboard = pathname.startsWith('/dashboard')

  if (isPublic) return NextResponse.next()

  if (isAuth && session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if ((isDashboard || isAdmin) && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
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
