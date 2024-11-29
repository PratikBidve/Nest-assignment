import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Exclude, Type } from 'class-transformer';
import { Node } from './node.entity';
import { ExecutionState } from './execution-state.entity';

@Entity()
export class Workflow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column('jsonb')
  definition: Record<string, any>;

  @Column({ default: 'active' })
  status: 'active' | 'paused' | 'completed';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Node, (node) => node.workflow, { cascade: true })
  @Type(() => Node) // Serialize nodes
  nodes: Node[];

  @OneToMany(() => ExecutionState, (executionState) => executionState.workflow)
  @Exclude() // Exclude execution states
  executionStates: any[];
}
