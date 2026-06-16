import { NextResponse, type NextRequest } from 'next/server';

const STATIC_EXTENSION_REGEX = /\.(?!html|json)[^.]+$/i;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    STATIC_EXTENSION_REGEX.test(pathname)
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get('arcturus_admin_token')?.value;
  const isAuth = !!token;
  
  // Жорстко захищаємо тільки ці два роути. Всі інші захищені компонентом ProGate на фронті
  const isProtectedRoute = pathname.startsWith('/admin') || pathname.startsWith('/account');
  
  if (isProtectedRoute && !isAuth) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isAuth && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/account', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons|images).*)'],
};