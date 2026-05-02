import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { StrategyModule } from '../strategy/strategy.module';
import { CapitalController } from './capital.controller';
import { CapitalService } from './capital.service';

@Module({
  imports: [PrismaModule, StrategyModule],
  controllers: [CapitalController],
  providers: [CapitalService],
  exports: [CapitalService],
})
export class CapitalModule {}