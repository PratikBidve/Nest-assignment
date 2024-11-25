import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { taskQueueConfig } from './task-queue.config';
import { WorkflowService } from '../workflows/services/workflow.service';

@Injectable()
@Processor('workflow') // Queue name
export class WorkflowProcessor {
  private readonly logger = new Logger(WorkflowProcessor.name);

  constructor(private readonly workflowService: WorkflowService) {}

  @Process('execute-task') // Job type
  async handleTaskExecution(job: Job) {
    const { workflowId, nodeId } = job.data;

    try {
      this.logger.log(`Executing Node ${nodeId} for Workflow ${workflowId}`);

      // Logic to execute the node
      await this.workflowService.executeNode(workflowId, nodeId);

      this.logger.log(`Node ${nodeId} executed successfully`);
    } catch (error) {
      this.logger.error(
        `Node ${nodeId} execution failed: ${error.message}`,
        error.stack,
      );

      if (job.attemptsMade < taskQueueConfig.maxRetries) {
        this.logger.log(
          `Retrying Node ${nodeId} (${job.attemptsMade + 1}/${taskQueueConfig.maxRetries})`,
        );
        throw error; // Bull will automatically retry
      } else {
        this.logger.error(`Max retries reached for Node ${nodeId}.`);
      }
    }
  }
}