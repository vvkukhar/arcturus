import { Module } from '@nestjs/common';
import { NovaPoshtaService } from './nova-poshta.service';

@Module({
  providers: [NovaPoshtaService],
  exports: [NovaPoshtaService],
})
export class ShippingModule {}