import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Workflow } from './workflow.entity';
import { Node } from './node.entity';

@Entity()
export class ExecutionState {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Workflow, (workflow) => workflow.executionStates)
  @Exclude()
  workflow: Workflow;

  @ManyToOne(() => Node, (node) => node.executionStates)
  @Exclude()
  node: Node;

  @Column({ type: 'timestamp' })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ default: 'pending' })
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}
