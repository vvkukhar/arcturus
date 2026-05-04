import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getAdminToken();
  const headers = new Headers(init?.headers);

  if (!(init?.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
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
      let message = `API error ${response.status}`;
      try {
        const data = await response.json();
        message = data?.message || data?.error || message;
      } catch {}
      throw new Error(message);
    }

    if (response.status === 204) return null as T;
    return response.json() as Promise<T>;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export const api = {
  get: <T>(path: string, init?: RequestInit) => request<T>(path, init),
  post: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, { ...init, method: 'POST', body: JSON.stringify(body ?? {}) }),
  patch: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, { ...init, method: 'PATCH', body: JSON.stringify(body ?? {}) }),
  delete: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, { ...init, method: 'DELETE', body: JSON.stringify(body ?? {}) }),
};