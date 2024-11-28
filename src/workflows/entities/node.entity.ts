import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Workflow } from './workflow.entity';

@Entity()
export class Node {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: 'start' | 'end' | 'condition' | 'wait'; // Node type

  @Column('jsonb', { nullable: true })
  configuration: Record<string, any>; // Node-specific settings (e.g., wait time, conditions)

  @ManyToOne(() => Workflow, (workflow) => workflow.nodes, { onDelete: 'CASCADE' })
  workflow: Workflow; // Link to the parent workflow

  @Column({ nullable: true })
  nextNodeId: number; // ID of the next node in sequence, if applicable

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;


  @UpdateDateColumn()
  updatedAt: Date;
  executionStates: any;
  name: string;
 
}
