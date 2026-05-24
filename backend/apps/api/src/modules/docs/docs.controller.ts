import { Controller, Get, Version, VERSION_NEUTRAL } from '@nestjs/common';

@Controller() // 🔥 Прибрали 'docs-meta', тепер цей контролер обробляє корінь
export class DocsController {
  
  @Version(VERSION_NEUTRAL)
  @Get() // 🔥 Це обробить 'GET /'
  root() {
    return {
      service: 'Arcturus API',
      status: 'active',
      version: '1.0.0',
      description: 'Institutional LEGO trading engine',
      endpoints: {
        health: '/api/health',
        metrics: '/api/metrics'
      }
    };
  }

  @Version(VERSION_NEUTRAL)
  @Get('docs-meta') // 🔥 Старий маршрут залишили про всяк випадок
  meta(): unknown {
    return {
      name: 'Arcturus API',
      version: '1.0.0',
      description: 'LEGO trading operating system backend',
      docs: '/api/docs',
      openapiJson: '/api/docs-json',
    };
  }
}