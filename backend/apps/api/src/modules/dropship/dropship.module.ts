import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { DropshipController } from './dropship.controller';
import { DropshipService } from './dropship.service';
import { AuthModule } from '../auth/auth.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [PrismaModule, AuthModule, PaymentsModule],
  controllers: [DropshipController],
  providers: [DropshipService],
})
export class DropshipModule {}