import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { WorkflowProcessor } from './workflow.processor';
import { WorkflowScheduler } from './workflow.scheduler';
import { WorkflowsModule } from '../workflows/workflow.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'workflow', // Register the task queue for workflows
    }),
    WorkflowsModule, // Import workflows module to provide WorkflowService
  ],
  providers: [
    WorkflowProcessor, // Processes workflow-related tasks
    WorkflowScheduler, // Manages scheduling of tasks
  ],
  exports: [
    BullModule, // Export BullModule for other modules
    WorkflowProcessor, // Export processor for potential external use
    WorkflowScheduler, // Export scheduler for potential external use
  ],
})
export class TaskQueueModule {}