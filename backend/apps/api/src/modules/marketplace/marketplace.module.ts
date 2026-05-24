import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { MediaModule } from '../media/media.module';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceService } from './marketplace.service';
import { ScoutController } from './scout.controller'; // <---
import { ScoutService } from './scout.service';       // <---

@Module({
  imports: [PrismaModule, AuthModule, MediaModule],
  controllers: [MarketplaceController, ScoutController], // <---
  providers: [MarketplaceService, ScoutService],         // <---
  exports: [MarketplaceService, ScoutService],           // <---
})
export class MarketplaceModule {}