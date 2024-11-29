import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workflow } from '../entities/workflow.entity';
import { Node } from '../entities/node.entity';
import { CreateWorkflowDto } from '../dto/create-workflow.dto';
import { EventsGateway } from '../../events/events.gateway';
import { LoggerService } from '../../utils/logger.service';

interface WorkflowUpdatePayload {
  workflowId: number;
  nodeId: number | null;
  status: string;
  timestamp: string;
  workflowName?: string;
  nodeName?: string;
  message?: string;
}

@Injectable()
export class WorkflowService {
  constructor(
    @InjectRepository(Workflow)
    private readonly workflowRepository: Repository<Workflow>,
    @InjectRepository(Node)
    private readonly nodeRepository: Repository<Node>,
    private readonly eventsGateway: EventsGateway,
    private readonly logger: LoggerService,
  ) {}

  private sendWorkflowUpdate(payload: WorkflowUpdatePayload): void {
    this.eventsGateway.sendWorkflowUpdate(payload);
  }

  /**
   * Creates a new workflow and optionally associates nodes.
   */
  async createWorkflow(createWorkflowDto: CreateWorkflowDto): Promise<Workflow> {
    const { name, definition, nodes } = createWorkflowDto;

    const existingWorkflow = await this.workflowRepository.findOne({ where: { name } });
    if (existingWorkflow) {
      throw new ConflictException(`A workflow with the name "${name}" already exists.`);
    }

    const workflow = this.workflowRepository.create({ name, definition });
    const savedWorkflow = await this.workflowRepository.save(workflow);

    if (nodes?.length > 0) {
      const nodeEntities = nodes.map((node) => {
        return this.nodeRepository.create({ ...node, name: node.name, workflow: savedWorkflow });
      });
      await this.nodeRepository.save(nodeEntities);
    }

    this.sendWorkflowUpdate({
      workflowId: savedWorkflow.id,
      nodeId: null,
      status: 'created',
      timestamp: new Date().toISOString(),
      workflowName: savedWorkflow.name,
      message: `Workflow "${savedWorkflow.name}" has been created successfully.`,
    });

    this.logger.log(`Workflow with ID ${savedWorkflow.id} created successfully`, 'WorkflowService');
    return savedWorkflow;
  }

  /**
   * Retrieves a workflow by ID.
   */
  async getWorkflowById(id: number): Promise<Workflow> {
    this.logger.log(`Fetching workflow with ID: ${id}`, 'WorkflowService');
    const workflow = await this.workflowRepository.findOne({
      where: { id },
      relations: ['nodes'],
    });

    if (!workflow) {
      this.logger.warn(`Workflow with ID ${id} not found`, 'WorkflowService');
      throw new NotFoundException(`Workflow with ID ${id} not found`);
    }

    workflow.nodes = workflow.nodes.map(node => {
      return {
        ...node,
        workflow: undefined,
      };
    });

    this.logger.log(`Workflow with ID ${id} fetched successfully`, 'WorkflowService');
    return workflow;
  }

  /**
   * Retrieves all existing workflows.
   */
  async getAllWorkflows(page = 1, limit = 10): Promise<Workflow[]> {
    this.logger.log(`Fetching workflows (Page: ${page}, Limit: ${limit})`, 'WorkflowService');
    const workflows = await this.workflowRepository.find({
        skip: (page - 1) * limit,
        take: limit,
        relations: ['nodes'],
    });

    workflows.forEach(workflow => {
        workflow.nodes = workflow.nodes.map(node => {
            return {
                ...node,
                workflow: undefined,
            };
        });
    });

    this.logger.log(`Workflows fetched successfully (Page: ${page}, Limit: ${limit})`, 'WorkflowService');
    return workflows;
  }


  /**
   * Updates a workflow and its associated nodes.
   */
  async updateWorkflow(id: number, updateData: Partial<CreateWorkflowDto>): Promise<Workflow> {
    this.logger.log(`Updating workflow with ID: ${id}`, 'WorkflowService');

    const workflow = await this.getWorkflowById(id);
    Object.assign(workflow, updateData);

    if (updateData.nodes?.length) {
      this.logger.log(`Updating nodes for workflow ID: ${id}`, 'WorkflowService');

      // Delete existing nodes
      await this.nodeRepository.delete({ workflow: { id } });

      // Add updated nodes
      const nodeEntities = updateData.nodes.map((node) =>
        this.nodeRepository.create({ ...node, workflow }),
      );
      await this.nodeRepository.save(nodeEntities);
    }

    const updatedWorkflow = await this.workflowRepository.save(workflow);

    // Send WebSocket update for workflow update
    this.sendWorkflowUpdate({
      workflowId: updatedWorkflow.id,
      nodeId: null,
      status: 'updated',
      timestamp: new Date().toISOString(),
      workflowName: updatedWorkflow.name,
      message: `Workflow "${updatedWorkflow.name}" has been updated successfully.`
    });

    this.logger.log(`Workflow with ID ${id} updated successfully`, 'WorkflowService');
    return updatedWorkflow;
  }

  /**
   * Deletes a workflow and its associated nodes.
   */
  async deleteWorkflow(id: number): Promise<{ message: string; workflowId: number }> {
    this.logger.log(`Deleting workflow with ID: ${id}`, 'WorkflowService');

    const workflow = await this.getWorkflowById(id);
    await this.nodeRepository.delete({ workflow: { id: workflow.id } });
    await this.workflowRepository.delete(id);

    // Send WebSocket update for workflow deletion
    this.sendWorkflowUpdate({
        workflowId: id,
        nodeId: null,
        status: 'deleted',
        timestamp: new Date().toISOString(),
        workflowName: workflow.name,
        message: `Workflow "${workflow.name}" has been deleted successfully.`
    });

    this.logger.log(`Workflow with ID ${id} deleted successfully`, 'WorkflowService');

    // Return a success message
    return {
        message: `Workflow "${workflow.name}" has been deleted successfully.`,
        workflowId: id
    };
}


  /**
   * Executes a specific node within a workflow.
   */
  async executeNode(workflowId: number, nodeId: number): Promise<void> {
    this.logger.log(`Starting execution of Node ${nodeId} in Workflow ${workflowId}`, 'WorkflowService');

    const workflow = await this.getWorkflowById(workflowId);
    const node = workflow.nodes.find((n) => n.id === nodeId);

    if (!node) {
      this.logger.error(`Node ${nodeId} not found in Workflow ${workflowId}`, 'WorkflowService');
      throw new NotFoundException(`Node ${nodeId} not found in Workflow ${workflowId}`);
    }

    const nodeName = node.configuration?.action || node.type;

    // Send workflow update for node execution start
    this.sendWorkflowUpdate({
      workflowId,
      nodeId,
      status: 'in_progress',
      timestamp: new Date().toISOString(),
      workflowName: workflow.name,
      nodeName,
      message: `Node "${nodeName}" is being executed as part of Workflow "${workflow.name}".`,
    });

    // Simulate execution
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Send workflow update for node execution completion
    this.sendWorkflowUpdate({
      workflowId,
      nodeId,
      status: 'completed',
      timestamp: new Date().toISOString(),
      workflowName: workflow.name,
      nodeName,
      message: `Node "${nodeName}" has completed execution in Workflow "${workflow.name}".`,
    });

    this.logger.log(`Node ${nodeId} executed successfully for Workflow ${workflowId}`, 'WorkflowService');

    if (node.configuration.nextNodeId) {
      await this.executeNode(workflowId, node.configuration.nextNodeId);
    }
  }
}
