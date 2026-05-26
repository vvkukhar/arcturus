import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { LiveController } from './live.controller';
import { LiveService } from './live.service';

@Module({
  imports: [PrismaModule, AuthModule, RealtimeModule],
  controllers: [LiveController],
  providers: [LiveService],
})
export class LiveModule {}