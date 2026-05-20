import { Global, Module } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';
import { PrismaModule } from '../prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [RealtimeGateway],
  exports: [RealtimeGateway],
})
export class RealtimeModule {}