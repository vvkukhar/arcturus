import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { DropshipController } from './dropship.controller';
import { DropshipService } from './dropship.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [DropshipController],
  providers: [DropshipService],
})
export class DropshipModule {}