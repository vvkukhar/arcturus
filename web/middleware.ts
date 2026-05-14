import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_PATHS = new Set(['/manifest.json', '/favicon.ico', '/login', '/register']);
const STATIC_EXTENSION_REGEX = /\.(?!html|json)[^.]+$/i;
const JWT_SECRET = process.env.JWT_SECRET ? new TextEncoder().encode(process.env.JWT_SECRET) : null;

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
  const isAdminRoute = pathname.startsWith('/admin');
  const isPublicPath = PUBLIC_PATHS.has(pathname);
  let isAuth = false;

  if (token && JWT_SECRET) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isAuth = true;
    } catch {}
  }

  if (isAdminRoute && !isAuth) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isPublicPath && isAuth && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }

  const res = NextResponse.next();
  
  res.headers.set('X-Arcturus-Auth', isAuth ? '1' : '0');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  if (process.env.NODE_ENV === 'production') {
    res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons|images).*)'],
};