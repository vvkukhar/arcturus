import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { B2bController } from './b2b.controller';
import { B2bGuard } from './b2b.guard';

@Module({
  imports: [PrismaModule],
  controllers: [B2bController],
  providers: [B2bGuard],
})
export class B2bModule {}