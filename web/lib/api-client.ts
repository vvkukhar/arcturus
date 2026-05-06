import { appConfig } from './config';

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function apiClient<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { requireAuth = true, headers: customHeaders, ...init } = options;
  const headers = new Headers(customHeaders);

  if (!(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (requireAuth) {
    const token = typeof window === 'undefined' 
      ? await (await import('./server-auth')).getAdminToken() 
      : document.cookie.split('; ').find(row => row.startsWith('arcturus_admin_token='))?.split('=')[1];

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
      ...init,
      headers,
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `API error ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData?.message || errorData?.error || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }

    if (response.status === 204) return null as T;
    return response.json() as Promise<T>;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export const api = {
  get: <T>(path: string, opts?: FetchOptions) => apiClient<T>(path, { ...opts, method: 'GET' }),
  post: <T>(path: string, body?: unknown, opts?: FetchOptions) => apiClient<T>(path, { ...opts, method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown, opts?: FetchOptions) => apiClient<T>(path, { ...opts, method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string, body?: unknown, opts?: FetchOptions) => apiClient<T>(path, { ...opts, method: 'DELETE', body: JSON.stringify(body) }),
};