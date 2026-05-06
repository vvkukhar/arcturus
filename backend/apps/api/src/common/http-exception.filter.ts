import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;

    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const rawResponse = isHttpException
      ? exception.getResponse()
      : null;

    const message =
      typeof rawResponse === 'object' &&
      rawResponse !== null &&
      'message' in rawResponse
        ? (rawResponse as any).message
        : exception instanceof Error
          ? exception.message
          : 'Internal server error';

    const error =
      typeof rawResponse === 'object' &&
      rawResponse !== null &&
      'error' in rawResponse
        ? (rawResponse as any).error
        : isHttpException
          ? exception.name
          : 'InternalServerError';

    response.status(status).json({
      ok: false,
      statusCode: status,
      error,
      message,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
    });
  }
}