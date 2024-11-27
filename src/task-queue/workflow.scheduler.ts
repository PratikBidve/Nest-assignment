import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { WorkflowService } from '../workflows/services/workflow.service';

@Injectable()
@Processor('workflow') // Queue name
export class WorkflowScheduler {
  private readonly logger = new Logger(WorkflowScheduler.name);

  constructor(private readonly workflowService: WorkflowService) {}

  @Process('delayed-task') // Job type
  async handleDelayedTask(job: Job) {
    const { workflowId, nodeId, delay } = job.data;
    this.logger.log(`Processing delayed task for Node ${nodeId} after ${delay}ms`);

    // Logic to execute the workflow node after the delay
    await new Promise((resolve) => setTimeout(resolve, delay)); // Simulated delay

    // Continue the workflow execution
    await this.workflowService.executeNode(workflowId, nodeId);
  }
}