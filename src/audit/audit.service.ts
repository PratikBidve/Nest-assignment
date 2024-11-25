import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
  ) {}

  async logAction(action: string, userId: number, metadata?: any): Promise<void> {
    const log = this.auditRepository.create({ action, userId, metadata });
    await this.auditRepository.save(log);
  }
}
