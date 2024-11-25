import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { WorkflowsModule } from './workflows/workflow.module';
import { BullModule } from '@nestjs/bull'; // Import BullModule
import { TaskQueueModule } from './task-queue/task-queue.module'; // Import TaskQueueModule
import { HealthModule } from './health/health.module';
import { AuditModule } from './audit/audit.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from '../src/utils/logger.module'; 
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule global across the app
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any, 
      host: process.env.PG_HOST,
      port: parseInt(process.env.PG_PORT, 10),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Use only in development
    }),
    BullModule.forRoot({ // Add BullModule configuration
      redis: {
        host: process.env.REDIS_HOST || 'localhost', // Default Redis host
        port: parseInt(process.env.REDIS_PORT, 10) || 6379, // Default Redis port
      },
    }),
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 10,
    }]),
    UsersModule,
    AuthModule,
    WorkflowsModule,
    TaskQueueModule,
    HealthModule,
    AuditModule,
    LoggerModule,
    EventsModule
  ],
  controllers: [AppController],
  providers: [AppService] 
})
export class AppModule {}