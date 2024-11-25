import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Module({
  providers: [LoggerService], // Register LoggerService
  exports: [LoggerService],   // Export LoggerService for use in other modules
})
export class LoggerModule {}
