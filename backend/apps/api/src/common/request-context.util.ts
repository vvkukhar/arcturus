export function getRequestIp(request: any): string | null {
  const forwarded = request.headers?.['x-forwarded-for'];

  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }

  return request.ip ?? request.socket?.remoteAddress ?? null;
}

export function getUserAgent(request: any): string | null {
  const userAgent = request.headers?.['user-agent'];

  return typeof userAgent === 'string' ? userAgent : null;
}

export function getActorUserId(request: any): string | null {
  return request.user?.id ?? request.user?.sub ?? null;
}