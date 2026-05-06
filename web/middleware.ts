import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = new Set(['/manifest.json', '/favicon.ico']);
const STATIC_REGEX = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    PUBLIC_PATHS.has(pathname) || 
    STATIC_REGEX.test(pathname)
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('arcturus_admin_token')?.value;
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginRoute = pathname === '/login';

  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isLoginRoute && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  const response = NextResponse.next();
  response.headers.set('X-Arcturus-Auth-State', token ? 'authenticated' : 'guest');
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons|images).*)'],
};