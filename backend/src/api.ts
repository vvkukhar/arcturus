import fetch from 'node-fetch';
import { appConfig } from './config';
import { requireAdmin } from './auth';

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
  headers?: Record<string, string>
): Promise<T> {
  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function adminApiRequest<T>(
  path: string,
  token: string,
  init?: RequestInit
): Promise<T> {
  requireAdmin({ authorization: `Bearer ${token}` });

  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Admin API error ${response.status}`);
  }

  return response.json() as Promise<T>;
}