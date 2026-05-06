import { Body, Controller, Post, Param, Headers } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('webhook')
  async handleWebhook(
    @Body() body: any,
    @Headers('X-Sign') xSign?: string
  ): Promise<{ received: boolean }> {
    return this.paymentsService.handleWebhook(body, xSign);
  }

  @Post('checkout/:orderId')
  async createCheckoutSession(@Param('orderId') orderId: string): Promise<{ url: string }> {
    return this.paymentsService.createCheckoutSession(orderId);
  }
}