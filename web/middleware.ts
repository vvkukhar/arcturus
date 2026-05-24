import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_PATHS = new Set(['/manifest.json', '/favicon.ico', '/login', '/register', '/store', '/about', '/delivery', '/track']);
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
  const isAdminRoute = pathname.startsWith('/admin');
  const isAuth = !!token;
  
  // Якщо юзер на адмінці, але немає токена — на логін
  if (isAdminRoute && !isAuth) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Якщо авторизований юзер заходить на логін/реєстрацію — на дашборд або акаунт
  if (isAuth && (pathname === '/login' || pathname === '/register')) {
    // В ідеалі тут треба перевірити роль через /api/auth/me, 
    // але для швидкості кидаємо в кабінет, а AuthGate на фронті розрулить
    return NextResponse.redirect(new URL('/account', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons|images).*)'],
};