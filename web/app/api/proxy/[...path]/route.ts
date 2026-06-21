import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

export const dynamic = 'force-dynamic';

async function handleProxy(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await props.params;
    const token = await getAdminToken();
    
    // 🔥 ФІКС БЕЗПЕКИ ТА РОУТИНГУ: замість кривої регулярки юзаємо encodeURIComponent
    const sanitizedPath = path.map(p => encodeURIComponent(p)).join('/');
    
    if (!token && !sanitizedPath.startsWith('public/')) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const backendUrl = `${appConfig.apiBaseUrl}/${sanitizedPath}${url.search}`;
    
    const headers = new Headers();
    headers.set('Accept', 'application/json');
    
    const incomingContentType = req.headers.get('content-type');
    if (incomingContentType) {
      headers.set('Content-Type', incomingContentType);
    }
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const options: RequestInit = {
      method: req.method,
      headers,
      redirect: 'manual',
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const buffer = await req.arrayBuffer();
      if (buffer.byteLength > 0) {
        options.body = buffer;
      }
    }

    const response = await fetch(backendUrl, options);
    
    if (response.status >= 500) {
       const errText = await response.text().catch(() => '');
       return NextResponse.json(
         { ok: false, error: `Backend Error ${response.status}`, details: errText, url: backendUrl }, 
         { status: response.status } 
       );
    }

    const resText = await response.text();
    
    let data;
    try {
      data = resText ? JSON.parse(resText) : null;
    } catch {
      data = resText; 
    }

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Cache-Control': 'no-store, no-cache, max-age=0, must-revalidate',
      }
    });

  } catch (error: any) {
    console.error('[Proxy Error]', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 504 });
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PATCH = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;