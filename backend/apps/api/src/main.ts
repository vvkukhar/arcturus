import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { strictValidationPipe } from './common/strict-validation.pipe';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { cors: false });
  const corsEnv = process.env.CORS_ORIGINS ?? '';
  const allowedOrigins = corsEnv.split(',').map((o) => o.trim()).filter(Boolean);

  app.enableCors({
    origin: corsEnv === '*' ? true : (origin, cb) => {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error('CORS Error'), false);
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(strictValidationPipe);

  await app.listen(Number(process.env.PORT ?? 4000));
}
bootstrap();