import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

export async function POST(request: NextRequest) {
  const token = await getAdminToken();
  const body = await request.json();

  const response = await fetch(`${appConfig.apiBaseUrl}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (!response.ok) {
    // 🔥 Витягуємо РЕАЛЬНУ помилку з бекенду замість хардкоду 500
    const errData = await response.json().catch(() => ({}));
    return NextResponse.json(
      { ok: false, error: errData.message || `Item create failed: ${response.status}` },
      { status: response.status }, // Повертаємо реальний статус (наприклад, 400)
    );
  }

  return NextResponse.json({ ok: true, data: await response.json() });
}