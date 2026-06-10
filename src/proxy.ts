import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = ['/', '/pricing', '/about', '/contact', '/blog', '/resources']
const authPaths = ['/login', '/signup', '/forgot-password']
const adminPaths = ['/admin']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get('__session')?.value

  const isPublic = publicPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  const isAuth = authPaths.some((p) => pathname === p)
  const isAdmin = adminPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  const isDashboard = pathname.startsWith('/dashboard')

  if (isPublic) return NextResponse.next()

  if (isDashboard && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuth && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
