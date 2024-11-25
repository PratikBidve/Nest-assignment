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
    WorkflowsModule, // Import the workflows module to use WorkflowService
  ],
  providers: [WorkflowProcessor, WorkflowScheduler], // Register processors and schedulers
  exports: [BullModule, WorkflowProcessor, WorkflowScheduler], // Export for external use if needed
})
export class TaskQueueModule {}