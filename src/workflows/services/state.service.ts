import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExecutionState } from '../entities/execution-state.entity';

@Injectable()
export class StateService {
  constructor(
    @InjectRepository(ExecutionState)
    private readonly executionStateRepository: Repository<ExecutionState>,
  ) {}

  async startNodeExecution(workflowId: number, nodeId: number): Promise<ExecutionState> {
    const state = this.executionStateRepository.create({
      workflow: { id: workflowId },
      node: { id: nodeId },
      startedAt: new Date(),
      status: 'in_progress',
    });
    return this.executionStateRepository.save(state);
  }

  async completeNodeExecution(stateId: number): Promise<ExecutionState> {
    const state = await this.executionStateRepository.findOne({ where: { id: stateId } });
    state.completedAt = new Date();
    state.status = 'completed';
    return this.executionStateRepository.save(state);
  }
}