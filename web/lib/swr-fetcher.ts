import { apiFetch } from './api';

export const swrFetcher = async <T>(url: string): Promise<T> => {
  return apiFetch<T>(url);
};