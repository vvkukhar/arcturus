import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { strictValidationPipe } from './common/strict-validation.pipe';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    cors: false,
  });

  const corsEnv = process.env.CORS_ORIGINS ?? '';
  const isWildcard = corsEnv === '*';
  const allowedOrigins = corsEnv
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: isWildcard
      ? true
      : (origin, callback) => {
          if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
          }
          callback(new Error('Origin not allowed by CORS'), false);
        },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(strictValidationPipe);

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
}

bootstrap();