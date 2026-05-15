import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './modules/realtime/redis-io.adapter';
import { GlobalHttpExceptionFilter } from './common/http-exception.filter';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'production' ? ['error', 'warn', 'log'] : ['error', 'warn', 'log', 'debug', 'verbose'],
    bufferLogs: true,
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

  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    dnsPrefetchControl: { allow: false },
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    ieNoOpen: true,
    noSniff: true,
    xssFilter: true,
  }));
  
  app.use(compression({ level: 6, threshold: 256 }));
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  // ФІКС: Дозволяємо доступ з будь-якого Origin і вимикаємо credentials, щоб Chrome не блокував CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, x-api-key, X-Requested-With',
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    transform: true, 
    forbidNonWhitelisted: true,
    transformOptions: { enableImplicitConversion: true },
    // ФІКС: Показуємо деталі помилок валідації навіть у продакшені, щоб бачити, що не так
    disableErrorMessages: false,
  }));
  
  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  app.enableShutdownHooks();

  const port = process.env.PORT || process.env.RENDER_PORT || 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`[Arcturus] API successfully started and listening on port ${port}`);
}
bootstrap();