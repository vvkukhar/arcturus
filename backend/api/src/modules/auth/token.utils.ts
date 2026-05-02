import { Request } from 'express';

export function extractBearerToken(header?: string): string | null {
  if (!header) {
    return null;
  }

  const [type, token] = header.split(' ');

  if (type !== 'Bearer' || !token) {
    return null;
  }

  return token;
}

export function extractAuthToken(request: Request): string | null {
  const bearer = extractBearerToken(request.headers.authorization);

  if (bearer) {
    return bearer;
  }

  const cookieToken = request.cookies?.arcturus_admin_token;

  if (typeof cookieToken === 'string' && cookieToken.trim()) {
    return cookieToken.trim();
  }

  return null;
}