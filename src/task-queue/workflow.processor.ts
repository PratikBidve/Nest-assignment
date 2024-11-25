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
      this.logger.log(`Starting execution for Node ${nodeId} in Workflow ${workflowId}`);

      // Delegate execution to WorkflowService
      await this.workflowService.executeNode(workflowId, nodeId);

      this.logger.log(`Successfully executed Node ${nodeId} in Workflow ${workflowId}`);
    } catch (error) {
      this.logger.error(
        `Failed to execute Node ${nodeId} in Workflow ${workflowId}: ${error.message}`,
        error.stack,
      );

      if (job.attemptsMade < taskQueueConfig.maxRetries) {
        this.logger.log(
          `Retrying Node ${nodeId} (${job.attemptsMade + 1}/${taskQueueConfig.maxRetries})`,
        );
        throw error; // Trigger retry mechanism in Bull
      } else {
        this.logger.error(`Max retries reached for Node ${nodeId}.`);
      }
    }
  }
}