import { NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

export async function GET() {
  try {
    const token = await getAdminToken();

    if (!token) {
      return NextResponse.json(null, { status: 401 });
    }

    const res = await fetch(`${appConfig.apiBaseUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json(null, { status: 401 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    // Якщо бекенд (NestJS) вимкнений, fetch викине помилку ECONNREFUSED.
    // Перехоплюємо її і повертаємо 401, щоб AuthGate коректно викинув нас на /login
    return NextResponse.json(null, { status: 401 });
  }
}