import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('arcturus_admin_token')?.value;
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.startsWith('/icons') ||
    pathname.startsWith('/images') ||
    pathname === '/favicon.ico' ||
    pathname === '/manifest.json' ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginRoute = pathname === '/login';

  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isLoginRoute && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|icons|images).*)',
  ],
};