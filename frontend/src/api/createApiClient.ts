import { ApiClient } from './api.client';

const TOKEN_KEY = 'arcturus_token';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(TOKEN_KEY);
}

export function createApiClient(): ApiClient {
  const baseUrl =
    import.meta.env.VITE_API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    'http://localhost:4000/api';

  return new ApiClient({
    baseUrl,
    getToken: getStoredToken,
    onUnauthorized: clearStoredToken,
  });
}

export const api = createApiClient();