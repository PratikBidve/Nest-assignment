import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowsController } from './workflows.controller';
import { WorkflowService } from './services/workflow.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { Workflow } from './entities/workflow.entity';

describe('WorkflowsController', () => {
  let controller: WorkflowsController;
  let service: WorkflowService;

  const mockWorkflowService = {
    getAllWorkflows: jest.fn(),
    createWorkflow: jest.fn(),
    getWorkflowById: jest.fn(),
    updateWorkflow: jest.fn(),
    deleteWorkflow: jest.fn(),
  };

  const mockWorkflow = {
    id: 1,
    name: 'Test Workflow',
    nodes: [],
    definition: {},
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    executionStates: [],
  } as Workflow;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkflowsController],
      providers: [
        {
          provide: WorkflowService,
          useValue: mockWorkflowService,
        },
      ],
    }).compile();

    controller = module.get<WorkflowsController>(WorkflowsController);
    service = module.get<WorkflowService>(WorkflowService);
  });

  it('should return an array of workflows', async () => {
    mockWorkflowService.getAllWorkflows.mockResolvedValue([mockWorkflow]);

    const result = await controller.getAllWorkflows();
    expect(result).toEqual([mockWorkflow]);
  });

  it('should create a workflow', async () => {
    const createWorkflowDto: CreateWorkflowDto = {
      name: 'New Workflow',
      definition: {},
      nodes: [],
    };

    mockWorkflowService.createWorkflow.mockResolvedValue(mockWorkflow);

    const result = await controller.createWorkflow(createWorkflowDto);
    expect(result).toEqual(mockWorkflow);
  });

  it('should return a workflow by ID', async () => {
    mockWorkflowService.getWorkflowById.mockResolvedValue(mockWorkflow);

    const result = await controller.getWorkflow(1);
    expect(result).toEqual(mockWorkflow);
  });

  it('should update a workflow', async () => {
    const updatedWorkflow = { ...mockWorkflow, name: 'Updated Workflow' };
    mockWorkflowService.updateWorkflow.mockResolvedValue(updatedWorkflow);

    const result = await controller.updateWorkflow(1, { name: 'Updated Workflow' } as any);
    expect(result).toEqual(updatedWorkflow);
  });

  it('should delete a workflow', async () => {
    mockWorkflowService.deleteWorkflow.mockResolvedValue({ message: 'Workflow deleted.', workflowId: 1 });

    const result = await controller.deleteWorkflow(1);
    expect(result).toEqual({ message: 'Workflow with Id 1 has been successfully deleted.' });
  });
});
