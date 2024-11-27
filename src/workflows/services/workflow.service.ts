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
}

@Injectable()
export class WorkflowService {
  constructor(
    @InjectRepository(Workflow)
    private readonly workflowRepository: Repository<Workflow>,
    @InjectRepository(Node)
    private readonly nodeRepository: Repository<Node>,
    private readonly eventsGateway: EventsGateway,
    private readonly logger: LoggerService, // Inject LoggerService for structured logs
  ) {}

  /**
   * Creates a new workflow and optionally associates nodes.
   */
  async createWorkflow(createWorkflowDto: CreateWorkflowDto): Promise<Workflow> {
    const { name, definition, nodes } = createWorkflowDto;

    // Check if a workflow with the same name already exists
    const existingWorkflow = await this.workflowRepository.findOne({ where: { name } });
    if (existingWorkflow) {
      throw new ConflictException(`A workflow with the name "${name}" already exists.`);
    }

    // Create and save a new workflow
    const workflow = this.workflowRepository.create({ name, definition });
    const savedWorkflow = await this.workflowRepository.save(workflow);

    // Create and associate nodes if provided
    if (nodes?.length > 0) {
      const nodeEntities = nodes.map((node) =>
        this.nodeRepository.create({ ...node, workflow: savedWorkflow }),
      );
      await this.nodeRepository.save(nodeEntities);
      savedWorkflow.nodes = nodeEntities;
    }

    // Send WebSocket update for workflow creation
    this.eventsGateway.sendWorkflowUpdate({
      workflowId: savedWorkflow.id,
      nodeId: null,
      status: 'created',
      timestamp: new Date().toISOString(),
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

    this.logger.log(`Workflow with ID ${id} fetched successfully`, 'WorkflowService');
    return workflow;
  }

  /**
   * Updates a workflow and its associated nodes.
   */
  async updateWorkflow(id: number, updateData: Partial<CreateWorkflowDto>): Promise<Workflow> {
    this.logger.log(`Updating workflow with ID: ${id}`, 'WorkflowService');

    const workflow = await this.getWorkflowById(id);

    Object.assign(workflow, updateData);

    if (updateData.nodes?.length) {
      this.logger.log(
        `Updating ${updateData.nodes.length} nodes for workflow ID: ${id}`,
        'WorkflowService',
      );
      const nodeEntities = updateData.nodes.map((node) =>
        this.nodeRepository.create({ ...node, workflow }),
      );
      await this.nodeRepository.save(nodeEntities);
      workflow.nodes = nodeEntities;
    }

    const updatedWorkflow = await this.workflowRepository.save(workflow);

    // Send WebSocket update for workflow update
    this.eventsGateway.sendWorkflowUpdate({
      workflowId: updatedWorkflow.id,
      nodeId: null,
      status: 'updated',
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Workflow with ID ${id} updated successfully`, 'WorkflowService');
    return updatedWorkflow;
  }

  /**
   * Deletes a workflow and its associated nodes.
   */
  async deleteWorkflow(id: number): Promise<void> {
    this.logger.log(`Deleting workflow with ID: ${id}`, 'WorkflowService');

    const workflow = await this.getWorkflowById(id);
    await this.nodeRepository.delete({ workflow: { id: workflow.id } });
    await this.workflowRepository.delete(id);

    // Send WebSocket update for workflow deletion
    this.eventsGateway.sendWorkflowUpdate({
      workflowId: id,
      nodeId: null,
      status: 'deleted',
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Workflow with ID ${id} deleted successfully`, 'WorkflowService');
  }

  /**
   * Executes a specific node within a workflow.
   */
  async executeNode(workflowId: number, nodeId: number): Promise<void> {
    this.logger.log(
      `Starting execution of Node ${nodeId} in Workflow ${workflowId}`,
      'WorkflowService',
    );

    const workflow = await this.getWorkflowById(workflowId);
    const node = workflow.nodes.find((n) => n.id === nodeId);

    if (!node) {
      this.logger.error(
        `Node ${nodeId} not found in Workflow ${workflowId}`,
        'WorkflowService',
      );
      throw new NotFoundException(`Node ${nodeId} not found in Workflow ${workflowId}`);
    }

    // Send "in_progress" status update
    const updatePayload: WorkflowUpdatePayload = {
      workflowId,
      nodeId,
      status: 'in_progress',
      timestamp: new Date().toISOString(),
    };
    this.eventsGateway.sendWorkflowUpdate(updatePayload);

    // Simulate execution delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Send "completed" status update
    updatePayload.status = 'completed';
    this.eventsGateway.sendWorkflowUpdate(updatePayload);

    this.logger.log(
      `Node ${nodeId} executed successfully for Workflow ${workflowId}`,
      'WorkflowService',
    );
  }

  /**
   * Executes the next node in sequence within a workflow.
   */
  async executeNextNode(workflowId: number, nodeId: number): Promise<void> {
    this.logger.log(
      `Determining next node for Workflow ${workflowId}, starting from Node ${nodeId}`,
      'WorkflowService',
    );

    const workflow = await this.getWorkflowById(workflowId);

    const currentNodeIndex = workflow.nodes.findIndex((node) => node.id === nodeId);
    if (currentNodeIndex === -1 || currentNodeIndex === workflow.nodes.length - 1) {
      this.logger.warn(
        `No next node found for Workflow ${workflowId}, starting from Node ${nodeId}`,
        'WorkflowService',
      );
      return;
    }

    const nextNode = workflow.nodes[currentNodeIndex + 1];
    await this.executeNode(workflowId, nextNode.id);
  }

  /**
   * Executes multiple nodes concurrently within a workflow.
   */
  async executeParallelNodes(workflowId: number, nodeIds: number[]): Promise<void> {
    this.logger.log(
      `Starting parallel execution for Nodes ${nodeIds} in Workflow ${workflowId}`,
      'WorkflowService',
    );

    const workflow = await this.getWorkflowById(workflowId);

    const nodePromises = nodeIds.map(async (nodeId) => {
      const node = workflow.nodes.find((n) => n.id === nodeId);
      if (!node) {
        this.logger.error(
          `Node ${nodeId} not found in Workflow ${workflowId}`,
          'WorkflowService',
        );
        throw new NotFoundException(`Node ${nodeId} not found in Workflow ${workflowId}`);
      }

      const updatePayload: WorkflowUpdatePayload = {
        workflowId,
        nodeId,
        status: 'in_progress',
        timestamp: new Date().toISOString(),
      };

      this.eventsGateway.sendWorkflowUpdate(updatePayload);

      this.logger.log(`Executing Node ${nodeId} in Workflow ${workflowId}`, 'WorkflowService');
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay

      updatePayload.status = 'completed';
      this.eventsGateway.sendWorkflowUpdate(updatePayload);

      this.logger.log(`Node ${nodeId} executed successfully in Workflow ${workflowId}`, 'WorkflowService');
    });

    await Promise.all(nodePromises);
  }
}
