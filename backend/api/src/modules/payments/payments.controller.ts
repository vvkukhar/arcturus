import { Body, Controller, Post, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('webhook')
  async handleWebhook(@Body() body: any): Promise<{ received: boolean }> {
    return this.paymentsService.handleWebhook(body);
  }

  @Post('checkout/:orderId')
  async createCheckoutSession(@Param('orderId') orderId: string): Promise<{ url: string }> {
    return this.paymentsService.createCheckoutSession(orderId);
  }
}