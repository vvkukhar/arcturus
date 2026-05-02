import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void): void {
    const startedAt = Date.now();

    res.on('finish', () => {
      const durationMs = Date.now() - startedAt;

      if (process.env.NODE_ENV !== 'test') {
        console.log(
          JSON.stringify({
            type: 'http_request',
            method: req.method,
            path: req.originalUrl ?? req.url,
            statusCode: res.statusCode,
            durationMs,
            ip:
              req.headers?.['x-forwarded-for'] ??
              req.ip ??
              req.socket?.remoteAddress ??
              null,
          }),
        );
      }
    });

    next();
  }
}