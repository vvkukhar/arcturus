import { appConfig } from '@/lib/config';

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    let message = `API error ${response.status}`;

    try {
      const data = await response.json();

      if (typeof data?.message === 'string') {
        message = data.message;
      } else if (typeof data?.error === 'string') {
        message = data.error;
      }
    } catch {
      // ignore non-json error body
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

export const publicApi = {
  getCatalog: <T>(params?: {
    q?: string;
    type?: string;
    theme?: string;
    sort?: string;
    availableOnly?: boolean;
  }) => {
    const search = new URLSearchParams();

    if (params?.q) search.set('q', params.q);
    if (params?.type) search.set('type', params.type);
    if (params?.theme) search.set('theme', params.theme);
    if (params?.sort) search.set('sort', params.sort);
    if (params?.availableOnly != null) {
      search.set('availableOnly', String(params.availableOnly));
    }

    const suffix = search.toString() ? `?${search.toString()}` : '';
    return request<T>(`/public/catalog${suffix}`);
  },
  getCatalogItem: <T>(slug: string) =>
    request<T>(`/public/catalog/${encodeURIComponent(slug)}`),
  getAnalytics: <T>() => request<T>('/public/analytics'),
};