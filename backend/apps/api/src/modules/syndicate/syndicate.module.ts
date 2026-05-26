import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { SyndicateController } from './syndicate.controller';
import { SyndicateService } from './syndicate.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [SyndicateController],
  providers: [SyndicateService],
  exports: [SyndicateService],
})
export class SyndicateModule {}