import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import helmet from 'helmet';
import compression from 'compression';
import { Server as SocketIOServer } from 'socket.io';
import { AppModule } from './app.module';
import { GlobalHttpExceptionFilter } from './common/http-exception.filter';
import { json, urlencoded, Request, Response, NextFunction } from 'express';
import { RealtimeGateway } from './modules/realtime/realtime.gateway';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn', 'log']
        : ['error', 'warn', 'log', 'debug', 'verbose'],
    bufferLogs: true,
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[INCOMING] ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
    next();
  });

  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [nodeProfilingIntegration()],
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
      profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
      environment: process.env.NODE_ENV,
    });
  }

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
      dnsPrefetchControl: { allow: false },
      frameguard: { action: 'deny' },
      hidePoweredBy: true,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      ieNoOpen: true,
      noSniff: true,
      xssFilter: true,
    }),
  );

  app.use(
    compression({
      level: 6,
      threshold: 256,
    }),
  );

  app.use(
    json({
      limit: '10mb',
    }),
  );

  app.use(
    urlencoded({
      extended: true,
      limit: '10mb',
    }),
  );

  const allowedOrigins = [
    'https://www.arcturusbuild.com',
    'https://arcturusbuild.com',
    'http://localhost:3000',
  ];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      disableErrorMessages: false,
    }),
  );

  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  app.enableShutdownHooks();

  const port = process.env.PORT || process.env.RENDER_PORT || 4000;

  const httpServer = await app.listen(port, '0.0.0.0');

  console.log(`[Arcturus] API successfully started and listening on port ${port}`);

  const realtimeGateway = app.get(RealtimeGateway);

  const rawIo = new SocketIOServer(httpServer, {
    path: '/socket.io/',
    cors: {
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'OPTIONS'],
    },
    transports: ['websocket', 'polling'],
    allowEIO3: true,
    serveClient: false,
  });

  realtimeGateway.setServer(rawIo);

  rawIo.on('connection', (socket) => {
    console.log('[RAW_SOCKET_IO] CONNECTED:', socket.id);

    void realtimeGateway.handleConnection(socket);

    socket.on('disconnect', (reason) => {
      console.log('[RAW_SOCKET_IO] DISCONNECTED:', socket.id, reason);
      realtimeGateway.handleDisconnect(socket, reason);
    });
  });

  rawIo.engine.on('connection_error', (err) => {
    console.error('[RAW_SOCKET_IO] CONNECTION_ERROR');
    console.error('REQ_URL:', err.req?.url);
    console.error('CODE:', err.code);
    console.error('MESSAGE:', err.message);
    console.error('CONTEXT:', err.context);
  });

  console.log('[RAW_SOCKET_IO] Mounted on /socket.io/');
}

bootstrap();