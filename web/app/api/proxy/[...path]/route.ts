import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

async function handleProxy(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  const { path } = await props.params;
  const token = await getAdminToken();
  
  // ФІКС БЕЗПЕКИ: Видаляємо крапки, щоб унеможливити Directory Traversal (../)
  const sanitizedPath = path.map(p => p.replace(/[^a-zA-Z0-9\-_]/g, '')).join('/');
  
  if (!token && !sanitizedPath.startsWith('public/')) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const backendUrl = new URL(`${appConfig.apiBaseUrl}/${sanitizedPath}${url.search}`);
  
  // 🔥 БІЛИЙ СПИСОК ЗАГОЛОВКІВ. Ми більше не копіюємо сліпо всі заголовки від клієнта (Next.js/Vercel часто ламається від цього).
  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };

  // Прокидаємо токен, якщо є
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let bodyData: BodyInit | undefined = undefined;

  // Якщо запит містить тіло, ми намагаємось безпечно його прочитати
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      try {
        const jsonData = await req.json();
        bodyData = JSON.stringify(jsonData);
        headers['Content-Type'] = 'application/json';
      } catch (e) {
        console.error('[Proxy] Failed to parse incoming JSON body', e);
      }
    } else if (contentType.includes('multipart/form-data')) {
      try {
        // Якщо це завантаження файлу (як в media)
        bodyData = await req.formData();
        // ВАЖЛИВО: для formData НЕ треба вручну ставити Content-Type, fetch зробить це сам з boundary
      } catch (e) {
        console.error('[Proxy] Failed to parse incoming form data', e);
      }
    } else {
      // Фолбек для всього іншого (наприклад, x-www-form-urlencoded)
      try {
        bodyData = await req.text();
        if (contentType) headers['Content-Type'] = contentType;
      } catch (e) {
        console.error('[Proxy] Failed to read text body', e);
      }
    }
  }

  try {
    const response = await fetch(backendUrl.toString(), {
      method: req.method,
      headers,
      body: bodyData,
      cache: 'no-store',
    });

    // Намагаємось розпарсити відповідь від бекенду як JSON
    let responseData;
    const responseContentType = response.headers.get('content-type') || '';
    
    if (responseContentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    // Віддаємо "чисту" відповідь назад у Vercel
    return NextResponse.json(responseData, {
      status: response.status,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('[Proxy Error] Backend request failed:', error);
    return NextResponse.json(
      { ok: false, error: 'Gateway Timeout or Backend Unreachable. Check if API is running.' }, 
      { status: 504 }
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PATCH = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;