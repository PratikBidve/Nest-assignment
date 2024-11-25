import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowsController } from './workflows.controller';
import { WorkflowService } from './services/workflow.service';
import { NodeService } from './services/node.service';
import { StateService } from './services/state.service';
import { Node } from './entities/node.entity';
import { Workflow } from './entities/workflow.entity';
import { ExecutionState } from './entities/execution-state.entity';
import { EventsModule } from '../events/events.module';
import { LoggerModule } from '../utils/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workflow, Node, ExecutionState]),
    EventsModule, // Import EventsModule for WebSocket integration
    LoggerModule
  ],
  controllers: [WorkflowsController],
  providers: [WorkflowService, NodeService, StateService],
  exports: [WorkflowService, NodeService, StateService],
})
export class WorkflowsModule {}