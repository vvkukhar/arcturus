import { Module } from '@nestjs/common';
import { RealtimeModule } from '../realtime/realtime.module';
import { ScannerController } from './scanner.controller';
import { ScannerExecutorService } from './scanner-executor.service';
import { ScannerService } from './scanner.service';

@Module({
  imports: [RealtimeModule],
  controllers: [ScannerController],
  providers: [ScannerService, ScannerExecutorService],
  exports: [ScannerService, ScannerExecutorService],
})
export class ScannerModule {}