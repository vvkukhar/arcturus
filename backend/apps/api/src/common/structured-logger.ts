import { ConsoleLogger, LogLevel } from '@nestjs/common';

export class StructuredJsonLogger extends ConsoleLogger {
  protected printMessages(
    messages: unknown[],
    context?: string,
    logLevel?: LogLevel,
    writeStreamType?: 'stdout' | 'stderr'
  ) {
    messages.forEach((message) => {
      const logObj = {
        timestamp: new Date().toISOString(),
        level: logLevel,
        context: context || 'Application',
        message: typeof message === 'object' ? JSON.stringify(message) : message,
      };

      const out = JSON.stringify(logObj) + '\n';
      
      if (writeStreamType === 'stderr') {
        process.stderr.write(out);
      } else {
        process.stdout.write(out);
      }
    });
  }
}