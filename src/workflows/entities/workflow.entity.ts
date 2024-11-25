import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Node } from './node.entity';

@Entity()
export class Workflow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column('jsonb')
  definition: Record<string, any>; // JSON definition of the workflow

  @Column({ default: 'active' })
  status: 'active' | 'paused' | 'completed'; // Workflow state

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Node, (node) => node.workflow, { cascade: true })
  nodes: Node[];
  executionStates: any;
}
