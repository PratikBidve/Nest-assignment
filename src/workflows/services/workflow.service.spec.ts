import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowService } from './workflow.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Workflow } from '../entities/workflow.entity';
import { Node } from '../entities/node.entity';
import { LoggerService } from '../../utils/logger.service';
import { EventsGateway } from '../../events/events.gateway';

describe('WorkflowService', () => {
  let service: WorkflowService;
  let workflowRepo: Repository<Workflow>;
  let nodeRepo: Repository<Node>;

  const mockWorkflowRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  };

  const mockNodeRepo = {
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  const mockEventsGateway = {
    sendWorkflowUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkflowService,
        { provide: getRepositoryToken(Workflow), useValue: mockWorkflowRepo },
        { provide: getRepositoryToken(Node), useValue: mockNodeRepo },
        { provide: LoggerService, useValue: mockLogger },
        { provide: EventsGateway, useValue: mockEventsGateway },
      ],
    }).compile();

    service = module.get<WorkflowService>(WorkflowService);
    workflowRepo = module.get<Repository<Workflow>>(getRepositoryToken(Workflow));
    nodeRepo = module.get<Repository<Node>>(getRepositoryToken(Node));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createWorkflow', () => {
    it('should create and save a workflow', async () => {
      const dto = { name: 'Workflow', definition: {}, nodes: [] };
      const workflow = { id: 1, name: 'Workflow', definition: {} };

      mockWorkflowRepo.create.mockReturnValue(workflow);
      mockWorkflowRepo.save.mockResolvedValue(workflow);

      const result = await service.createWorkflow(dto);
      expect(result).toEqual(workflow);
      expect(mockWorkflowRepo.create).toHaveBeenCalledWith({ name: 'Workflow', definition: {} });
      expect(mockWorkflowRepo.save).toHaveBeenCalledWith(workflow);
    });
  });

  // Add additional tests for getWorkflowById, updateWorkflow, deleteWorkflow, and executeNode
});
