import { Controller, Get, Header } from '@nestjs/common';
import { FeedsService } from './feeds.service';

@Controller('feeds')
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}

  @Get('prom.xml')
  @Header('Content-Type', 'application/xml')
  async getPromFeed() {
    return this.feedsService.generatePromYml();
  }

  @Get('google.xml')
  @Header('Content-Type', 'application/xml')
  async getGoogleFeed() {
    return this.feedsService.generateGoogleXml();
  }
}