import { Body, Controller, Post } from '@nestjs/common';
import { NovaPoshtaService } from './nova-poshta.service';

@Controller('shipping')
export class ShippingController {
  constructor(private readonly npService: NovaPoshtaService) {}

  @Post('webhook/novaposhta')
  async handleNovaPoshtaWebhook(@Body() body: any) {
    // Ендпоінт: POST /api/v1/shipping/webhook/novaposhta
    return this.npService.handleWebhook(body);
  }
}