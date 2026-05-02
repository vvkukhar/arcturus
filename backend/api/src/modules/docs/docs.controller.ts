import { Controller, Get } from '@nestjs/common';

@Controller('docs-meta')
export class DocsController {
  @Get()
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