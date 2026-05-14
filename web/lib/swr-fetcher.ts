import { request, APIError, CircuitBreakerError } from './api';

export const swrFetcher = async <T>(url: string): Promise<T> => {
  try {
    return await request<T>(url, { method: 'GET', dedupe: true });
  } catch (error) {
    if (error instanceof CircuitBreakerError) {
      throw new Error('Service temporarily unavailable');
    }
    if (error instanceof APIError && error.status === 401) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('arcturus:unauthorized'));
      }
    }
    throw error;
  }
};