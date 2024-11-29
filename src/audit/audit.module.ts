// src/audit/audit.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './audit.entity';
import { AuditService } from './audit.service';
import { UsersModule } from '../users/users.module';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuditLog, User]), // Register both AuditLog and User entities
    forwardRef(() => UsersModule), // Import UsersModule to provide UserRepository
  ],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
