import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity'; // Import User entity to define relationship

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string;

  @Column()
  userId: number;

  @CreateDateColumn()
  timestamp: Date;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  // Define the relationship to User
  @ManyToOne(() => User, (user) => user.auditLogs, {
    onDelete: 'CASCADE', // Handle cascading delete
  })
  user: User;
}
