import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TerminusModule,
    HttpModule, // Import HttpModule to provide HttpService
  ],
  controllers: [HealthController],
})
export class HealthModule {}
