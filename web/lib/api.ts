import { appConfig } from './config';

export class APIError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = 'APIError';
  }
}

export class CircuitBreakerError extends Error {
  constructor(endpoint: string) {
    super(`Circuit open for: ${endpoint}`);
    this.name = 'CircuitBreakerError';
  }
}

interface CircuitState {
  failures: number;
  lastFailure: number;
  isOpen: boolean;
}

const circuitStates = new Map<string, CircuitState>();
const activeRequests = new Map<string, Promise<any>>();

const CB_CONFIG = {
  MAX_FAILURES: 3,
  RESET_TIMEOUT: 15000,
  BASE_BACKOFF: 250,
  MAX_BACKOFF: 3000,
  TIMEOUT: 15000,
};

function getCircuitState(endpoint: string): CircuitState {
  const key = endpoint.split('?')[0];
  let state = circuitStates.get(key);
  if (!state) {
    state = { failures: 0, lastFailure: 0, isOpen: false };
    circuitStates.set(key, state);
  }
  return state;
}

async function fetchWithRetry(url: string, options: RequestInit, retries = 2, attempt = 0): Promise<Response> {
  const signal = AbortSignal.timeout(CB_CONFIG.TIMEOUT);
  
  try {
    const res = await fetch(url, { ...options, signal });

    if (!res.ok && res.status >= 500 && retries > 0) {
      const delay = Math.min(CB_CONFIG.BASE_BACKOFF * (2 ** attempt) + (Math.random() * 100), CB_CONFIG.MAX_BACKOFF);
      await new Promise((r) => setTimeout(r, delay));
      return fetchWithRetry(url, options, retries - 1, attempt + 1);
    }
    return res;
  } catch (err) {
    if (retries > 0 && (err as Error).name !== 'TimeoutError') {
      const delay = Math.min(CB_CONFIG.BASE_BACKOFF * (2 ** attempt) + (Math.random() * 100), CB_CONFIG.MAX_BACKOFF);
      await new Promise((r) => setTimeout(r, delay));
      return fetchWithRetry(url, options, retries - 1, attempt + 1);
    }
    throw err;
  }
}

export interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
  tags?: string[];
  revalidate?: number;
  dedupe?: boolean;
}

export async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { requireAuth = true, tags, revalidate, dedupe = false, headers: customHeaders, ...init } = options;
  const headers = new Headers(customHeaders);
  const isServer = typeof window === 'undefined';
  
  const base = appConfig.apiBaseUrl.replace(/\/$/, '');
  let cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // ФІКС МАРШРУТИЗАЦІЇ
  let targetUrl = '';
  if (path.startsWith('http')) {
    targetUrl = path;
  } else if (!isServer && path.startsWith('/api/')) {
    // На клієнті запити залишаємо локальними (Next.js rewrites та API Routes їх перехоплять)
    // Просто вирізаємо /proxy/, якщо він є, щоб спрацювали rewrites з next.config.ts
    targetUrl = path.replace('/api/proxy/', '/api/');
  } else {
    // На сервері (Server Components) стукаємо напряму на бекенд для швидкості
    let clean = cleanPath;
    if (clean.startsWith('/api/proxy/')) {
      clean = clean.replace('/api/proxy/', '/');
    } else if (clean.startsWith('/api/')) {
      clean = clean.replace('/api/', '/');
    }
    targetUrl = `${base}${clean}`;
  }

  const requestKey = `${init.method || 'GET'}:${targetUrl}:${typeof init.body === 'string' ? init.body : ''}`;

  if (dedupe && isServer && (!init.method || init.method === 'GET') && activeRequests.has(requestKey)) {
    return activeRequests.get(requestKey);
  }

  const state = getCircuitState(targetUrl);

  if (state.isOpen) {
    if (Date.now() - state.lastFailure > CB_CONFIG.RESET_TIMEOUT) {
      state.isOpen = false;
      state.failures = 0;
    } else {
      throw new CircuitBreakerError(targetUrl);
    }
  }

  if (!(init.body instanceof FormData) && !headers.has('Content-Type') && init.method !== 'GET') {
    headers.set('Content-Type', 'application/json');
  }

  if (requireAuth) {
    let token: string | null = null;
    if (isServer) {
      const { cookies } = await import('next/headers');
      token = (await cookies()).get('arcturus_admin_token')?.value || null;
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

  const executeFetch = async () => {
    try {
      const response = await fetchWithRetry(targetUrl, fetchConfig);

      if (!response.ok) {
        state.failures += 1;
        if (state.failures >= CB_CONFIG.MAX_FAILURES) {
          state.isOpen = true;
          state.lastFailure = Date.now();
        }
        
        let errorData;
        try { errorData = await response.json(); } catch {}
        
        throw new APIError(
          response.status,
          errorData?.message || errorData?.error || `HTTP ${response.status}`,
          errorData
        );
      }

      state.failures = 0;
      if (response.status === 204) return null as T;
      return (await response.json()) as T;
    } catch (error) {
      state.failures += 1;
      if (state.failures >= CB_CONFIG.MAX_FAILURES) {
        state.isOpen = true;
        state.lastFailure = Date.now();
      }
      throw error;
    } finally {
      if (dedupe && isServer) {
        activeRequests.delete(requestKey);
      }
    }
  };

  if (dedupe && isServer && (!init.method || init.method === 'GET')) {
    const promise = executeFetch();
    activeRequests.set(requestKey, promise);
    return promise;
  }

  return executeFetch();
}

export const api = {
  get: <T>(path: string, opts?: FetchOptions) => request<T>(path, { ...opts, method: 'GET', dedupe: true }),
  post: <T>(path: string, body?: unknown, opts?: FetchOptions) => request<T>(path, { ...opts, method: 'POST', body: JSON.stringify(body ?? {}) }),
  patch: <T>(path: string, body?: unknown, opts?: FetchOptions) => request<T>(path, { ...opts, method: 'PATCH', body: JSON.stringify(body ?? {}) }),
  delete: <T>(path: string, body?: unknown, opts?: FetchOptions) => request<T>(path, { ...opts, method: 'DELETE', body: JSON.stringify(body ?? {}) }),
};

export const apiFetch = request;