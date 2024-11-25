import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowService } from './workflow.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Workflow } from '../entities/workflow.entity';
import { Node } from '../entities/node.entity';
import { Repository } from 'typeorm';
import { EventsGateway } from '../../events/events.gateway';

describe('WorkflowService', () => {
  let service: WorkflowService;
  let workflowRepo: Repository<Workflow>;
  let nodeRepo: Repository<Node>;
  let eventsGateway: EventsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkflowService,
        { provide: EventsGateway, useValue: { sendWorkflowUpdate: jest.fn() } },
        { provide: getRepositoryToken(Workflow), useClass: Repository },
        { provide: getRepositoryToken(Node), useClass: Repository },
      ],
    }).compile();

    service = module.get<WorkflowService>(WorkflowService);
    workflowRepo = module.get<Repository<Workflow>>(getRepositoryToken(Workflow));
    nodeRepo = module.get<Repository<Node>>(getRepositoryToken(Node));
    eventsGateway = module.get<EventsGateway>(EventsGateway);
  });

  it('should create a workflow', async () => {
    const mockWorkflow = { id: 1, name: 'Test Workflow', nodes: [] } as Workflow;
    jest.spyOn(workflowRepo, 'create').mockReturnValue(mockWorkflow);
    jest.spyOn(workflowRepo, 'save').mockResolvedValue(mockWorkflow);

    const result = await service.createWorkflow({ name: 'Test Workflow', definition: {}, nodes: [] });

    expect(result).toEqual(mockWorkflow);
    expect(workflowRepo.save).toHaveBeenCalled();
  });

  it('should throw an error if workflow is not found', async () => {
    jest.spyOn(workflowRepo, 'findOne').mockResolvedValue(null);

    await expect(service.getWorkflowById(1)).rejects.toThrowError(
      `Workflow with ID 1 not found`,
    );
  });

  it('should execute a node and send real-time updates', async () => {
    const mockWorkflow = {
      id: 1,
      nodes: [{ id: 2 }],
    } as Workflow;

    jest.spyOn(service, 'getWorkflowById').mockResolvedValue(mockWorkflow);
    const sendWorkflowUpdateSpy = jest.spyOn(eventsGateway, 'sendWorkflowUpdate');

    await service.executeNode(1, 2);

    expect(sendWorkflowUpdateSpy).toHaveBeenCalledWith({
      workflowId: 1,
      nodeId: 2,
      status: 'in_progress',
      timestamp: expect.any(String),
    });

    expect(sendWorkflowUpdateSpy).toHaveBeenCalledWith({
      workflowId: 1,
      nodeId: 2,
      status: 'completed',
      timestamp: expect.any(String),
    });
  });
});
