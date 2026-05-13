import { appConfig } from './config';

export class CircuitBreakerError extends Error {
  constructor(endpoint: string) {
    super(`Service unavailable: ${endpoint}`);
    this.name = 'CircuitBreakerError';
  }
}

interface CircuitState {
  failures: number;
  lastFailure: number;
  isOpen: boolean;
}

const circuitStates = new Map<string, CircuitState>();
const CB_MAX_FAILURES = 3;
const CB_RESET_TIMEOUT = 15000;

function getCircuitState(endpoint: string): CircuitState {
  const key = endpoint.split('?')[0];
  if (!circuitStates.has(key)) {
    circuitStates.set(key, { failures: 0, lastFailure: 0, isOpen: false });
  }
  return circuitStates.get(key)!;
}

async function fetchWithRetry(url: string, options: RequestInit, retries = 2, backoff = 250): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok && res.status >= 500 && retries > 0) {
      await new Promise((r) => setTimeout(r, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw err;
  }
}

export interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
  tags?: string[];
  revalidate?: number;
}

export async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { requireAuth = true, tags, revalidate, headers: customHeaders, ...init } = options;
  const headers = new Headers(customHeaders);
  const isServer = typeof window === 'undefined';
  const targetUrl = path.startsWith('http') ? path : `${appConfig.apiBaseUrl}${path}`;
  const state = getCircuitState(targetUrl);

  if (state.isOpen) {
    if (Date.now() - state.lastFailure > CB_RESET_TIMEOUT) {
      state.isOpen = false;
      state.failures = 0;
    } else {
      throw new CircuitBreakerError(targetUrl);
    }
  }

  if (!(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (requireAuth) {
    let token: string | null = null;
    if (isServer) {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      token = cookieStore.get('arcturus_admin_token')?.value || null;
    } else {
      const match = document.cookie.match(/(^| )arcturus_admin_token=([^;]+)/);
      token = match ? decodeURIComponent(match[2]) : null;
    }
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  const fetchConfig: RequestInit = {
    ...init,
    headers,
    cache: revalidate === undefined ? 'no-store' : undefined,
    next: revalidate !== undefined || tags ? { revalidate, tags } : undefined,
  };

  try {
    const response = await fetchWithRetry(targetUrl, fetchConfig);

    if (!response.ok) {
      state.failures += 1;
      if (state.failures >= CB_MAX_FAILURES) {
        state.isOpen = true;
        state.lastFailure = Date.now();
      }
      let errorMessage = `API error ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData?.message || errorData?.error || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }

    state.failures = 0;
    if (response.status === 204) return null as T;
    return response.json() as Promise<T>;
  } catch (error) {
    state.failures += 1;
    if (state.failures >= CB_MAX_FAILURES) {
      state.isOpen = true;
      state.lastFailure = Date.now();
    }
    throw error;
  }
}

export const api = {
  get: <T>(path: string, opts?: FetchOptions) => request<T>(path, { ...opts, method: 'GET' }),
  post: <T>(path: string, body?: unknown, opts?: FetchOptions) => request<T>(path, { ...opts, method: 'POST', body: JSON.stringify(body ?? {}) }),
  patch: <T>(path: string, body?: unknown, opts?: FetchOptions) => request<T>(path, { ...opts, method: 'PATCH', body: JSON.stringify(body ?? {}) }),
  delete: <T>(path: string, body?: unknown, opts?: FetchOptions) => request<T>(path, { ...opts, method: 'DELETE', body: JSON.stringify(body ?? {}) }),
};

export const apiFetch = request;