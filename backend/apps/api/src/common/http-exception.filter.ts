import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as Sentry from '@sentry/nestjs';

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalHttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    if (!isHttpException && process.env.NODE_ENV === 'production') {
      Sentry.captureException(exception);
      this.logger.error(`[Unhandled Exception] ${request.method} ${request.url}`, (exception as Error).stack);
    }

    const rawResponse = isHttpException ? exception.getResponse() : null;

    const message = typeof rawResponse === 'object' && rawResponse !== null && 'message' in rawResponse
        ? (rawResponse as any).message
        : exception instanceof Error
          ? exception.message
          : 'Internal server error';

    const error = typeof rawResponse === 'object' && rawResponse !== null && 'error' in rawResponse
        ? (rawResponse as any).error
        : isHttpException
          ? exception.name
          : 'InternalServerError';

    response.status(status).json({
      ok: false,
      statusCode: status,
      error,
      message: process.env.NODE_ENV === 'production' && status === 500 ? 'Internal server error' : message,
      path: request.url,
      timestamp: new Date().toISOString(),
      traceId: request.headers['x-request-id'] || null,
    });
  }
}