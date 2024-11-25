import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowProcessor } from './workflow.processor';
import { WorkflowService } from '../workflows/services/workflow.service';
import { Job } from 'bull';

describe('WorkflowProcessor', () => {
  let processor: WorkflowProcessor;
  let workflowService: WorkflowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkflowProcessor,
        { provide: WorkflowService, useValue: { executeNode: jest.fn() } },
      ],
    }).compile();

    processor = module.get<WorkflowProcessor>(WorkflowProcessor);
    workflowService = module.get<WorkflowService>(WorkflowService);
  });

  it('should execute a task successfully', async () => {
    const mockJob = { data: { workflowId: 1, nodeId: 2 }, attemptsMade: 0 } as Job;

    jest.spyOn(workflowService, 'executeNode').mockResolvedValue(undefined);

    await expect(processor.handleTaskExecution(mockJob)).resolves.not.toThrow();
    expect(workflowService.executeNode).toHaveBeenCalledWith(1, 2);
  });

  it('should retry a task if an error occurs', async () => {
    const mockJob = { data: { workflowId: 1, nodeId: 2 }, attemptsMade: 1 } as Job;

    jest.spyOn(workflowService, 'executeNode').mockRejectedValue(new Error('Execution failed'));

    await expect(processor.handleTaskExecution(mockJob)).rejects.toThrow('Execution failed');
  });
});
