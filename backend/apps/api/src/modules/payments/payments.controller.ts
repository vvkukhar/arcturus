import { Controller, Post, Body, BadRequestException, HttpCode, HttpStatus } from '@nestjs/common';
import { LiqPayService } from './liqpay.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly liqpay: LiqPayService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('liqpay-callback')
  @HttpCode(HttpStatus.OK)
  async handleCallback(@Body() body: { data: string; signature: string }) {
    const isValid = await this.liqpay.verifyCallback(body.data, body.signature);
    if (!isValid) throw new BadRequestException('Invalid signature');

    const decodedData = JSON.parse(Buffer.from(body.data, 'base64').toString());
    
    if (decodedData.status === 'success' || decodedData.status === 'sandbox') {
      await this.prisma.order.update({
        where: { id: decodedData.order_id },
        data: { status: 'paid' },
      });
    }

    return { status: 'ok' };
  }
}