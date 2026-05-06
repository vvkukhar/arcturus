import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { AppModule } from '../src/app.module';

async function main(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  const config = new DocumentBuilder()
    .setTitle('Arcturus API')
    .setDescription('LEGO trading operating system backend')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addCookieAuth('arcturus_admin_token')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const outputDir = join(process.cwd(), 'openapi');
  mkdirSync(outputDir, { recursive: true });

  writeFileSync(
    join(outputDir, 'openapi.json'),
    JSON.stringify(document, null, 2),
  );

  await app.close();

  console.log('[openapi] exported to openapi/openapi.json');
}

main().catch((error) => {
  console.error('[openapi] failed', error);
  process.exit(1);
});