import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('arcturus_admin_token')?.value;
  const { pathname } = request.nextUrl;

  // Пропускаємо статику, API та маніфест (вирішує проблему 401 в консолі)
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname === '/manifest.json' ||
    pathname.match(/\.(.*)$/)
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

  const response = NextResponse.next();
  response.headers.set('X-Arcturus-Auth-State', token ? 'authenticated' : 'guest');
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons|images).*)'],
};