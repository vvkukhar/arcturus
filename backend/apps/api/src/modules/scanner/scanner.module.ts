import { Module } from '@nestjs/common';
import { RealtimeModule } from '../realtime/realtime.module';
import { QueueModule } from '../queue/queue.module'; // 👈 ДОДАНО
import { ScannerController } from './scanner.controller';
import { ScannerExecutorService } from './scanner-executor.service';
import { ScannerService } from './scanner.service';

@Module({
  imports: [RealtimeModule, QueueModule], // 👈 ДОДАНО
  controllers: [ScannerController],
  providers: [ScannerService, ScannerExecutorService],
  exports: [ScannerService, ScannerExecutorService],
})
export class ScannerModule {}