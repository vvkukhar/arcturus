import { Global, Module } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';
import { RedisIoAdapter } from './redis-io.adapter';

@Global()
@Module({
  providers: [RealtimeGateway, RedisIoAdapter],
  exports: [RealtimeGateway, RedisIoAdapter],
})
export class RealtimeModule {}