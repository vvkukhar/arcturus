// call:function_1{"queries":["backend/apps/api/src/modules/payments/payments.controller.ts"]}
import { Controller, Post, Body, Param, Headers, BadRequestException, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post('checkout/:orderId')
  async createCheckout(@Param('orderId') orderId: string) {
    return this.payments.createCheckoutSession(orderId);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleMonoWebhook(
    @Body() body: any,
    @Headers('x-sign') signature?: string,
  ) {
    return this.payments.handleWebhook(body, signature);
  }
}