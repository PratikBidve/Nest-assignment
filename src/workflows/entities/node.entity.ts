import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Workflow } from './workflow.entity';

@Entity()
export class Node {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: 'start' | 'end' | 'condition' | 'wait';

  @Column({ nullable: true })
  name: string;

  @Column('jsonb', { nullable: true })
  configuration: Record<string, any>;

  @ManyToOne(() => Workflow, (workflow) => workflow.nodes, { onDelete: 'CASCADE' })
  @Exclude() // Prevent workflow from being serialized
  workflow: Workflow;

  @Column({ nullable: true })
  nextNodeId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
  executionStates: any;
}
