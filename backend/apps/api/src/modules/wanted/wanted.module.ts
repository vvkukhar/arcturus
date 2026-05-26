import { Module } from '@nestjs/common';
import { WantedService } from './wanted.service';
import { WantedController } from './wanted.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, NotificationsModule, AuthModule],
  controllers: [WantedController],
  providers: [WantedService],
  exports: [WantedService],
})
export class WantedModule {}