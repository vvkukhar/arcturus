import { NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

export async function GET() {
  try {
    const token = await getAdminToken();

    // Якщо немає токена, повертаємо 200 і null
    if (!token) {
      return NextResponse.json(null, { status: 200 }); 
    }

    const res = await fetch(`${appConfig.apiBaseUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      // ФІКС: Якщо токен невалідний або протух (401), примусово видаляємо куку
      if (res.status === 401) {
        const response = NextResponse.json(null, { status: 200 });
        response.cookies.delete('arcturus_admin_token');
        return response;
      }
      return NextResponse.json(null, { status: 200 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(null, { status: 200 });
  }
}