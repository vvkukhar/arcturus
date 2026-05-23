import { Global, Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';

@Global()
@Module({
  controllers: [ActivityController], // 🔥 ДОДАНО СЮДИ
  providers: [ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}