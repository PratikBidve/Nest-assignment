// src/audit/audit.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit.entity';
import { User } from '../users/user.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async logAction(action: string, userId: number, metadata?: any): Promise<void> {
    // Fetch the user entity first to create the relationship
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Create an audit log entry with the user relationship
    const log = this.auditRepository.create({ action, user, metadata });
    await this.auditRepository.save(log);
  }

  async deleteLogsByUserId(userId: number): Promise<void> {
    await this.auditRepository.delete({ user: { id: userId } });
  }
  
}
