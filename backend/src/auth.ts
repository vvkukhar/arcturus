import { appConfig } from './config';

export function verifyAdminToken(token?: string | null): boolean {
  return token === appConfig.adminToken;
}

export function requireAdmin(reqHeaders: Record<string, string | undefined>) {
  const token = reqHeaders['authorization']?.replace('Bearer ', '');
  if (!verifyAdminToken(token)) {
    throw new Error('Unauthorized: invalid admin token');
  }
}