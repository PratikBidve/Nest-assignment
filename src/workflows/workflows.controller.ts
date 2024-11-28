import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { WorkflowService } from './services/workflow.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { Workflow } from './entities/workflow.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // JWT Authentication Guard
import { RolesGuard } from '../auth/guards/roles.guard'; // Role-Based Access Guard
import { Roles } from '../auth/decorators/roles.decorator'; // Roles Decorator

@ApiTags('Workflows') // Group endpoints under "Workflows" in Swagger
@ApiBearerAuth() // Enables JWT authentication for all endpoints
@UseGuards(JwtAuthGuard, RolesGuard) // Protect all endpoints with JWT and RBAC
@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly workflowService: WorkflowService) {}

  /**
   * Retrieve all workflows
   * @returns An array of all workflows
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve all workflows' })
  @ApiResponse({ status: HttpStatus.OK, description: 'All workflows retrieved successfully.' })
  @Roles('user', 'admin') // Both "user" and "admin" roles can retrieve all workflows
  async getAllWorkflows(): Promise<Workflow[]> {
    return this.workflowService.getAllWorkflows();
  }

  /**
   * Create a new workflow
   * @param createWorkflowDto - The details of the workflow to create
   * @returns The created workflow
   */
  @Post()
  @ApiOperation({ summary: 'Create a new workflow' })
  @ApiBody({ type: CreateWorkflowDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Workflow created successfully.' })
  @Roles('admin') // Only users with the "admin" role can create workflows
  async createWorkflow(@Body() createWorkflowDto: CreateWorkflowDto): Promise<Workflow> {
    return this.workflowService.createWorkflow(createWorkflowDto);
  }

  /**
   * Retrieve a workflow by ID
   * @param id - The ID of the workflow
   * @returns The workflow details
   */
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a workflow by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Workflow ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Workflow retrieved successfully.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Workflow not found.' })
  @Roles('user', 'admin') // Both "user" and "admin" roles can retrieve workflows
  async getWorkflow(@Param('id', ParseIntPipe) id: number): Promise<Workflow> {
    return this.workflowService.getWorkflowById(id);
  }

  /**
   * Update an existing workflow
   * @param id - The ID of the workflow to update
   * @param updateData - The new data for the workflow
   * @returns The updated workflow
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing workflow' })
  @ApiParam({ name: 'id', type: Number, description: 'Workflow ID' })
  @ApiBody({ type: UpdateWorkflowDto, description: 'The workflow data to update' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Workflow updated successfully.' })
  @Roles('admin') // Only users with the "admin" role can update workflows
  async updateWorkflow(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateWorkflowDto,
  ): Promise<Workflow> {
    return this.workflowService.updateWorkflow(id, updateData);
  }

  /**
   * Delete a workflow by ID
   * @param id - The ID of the workflow to delete
   * @returns A 204 No Content status
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a workflow' })
  @ApiParam({ name: 'id', type: Number, description: 'Workflow ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Workflow deleted successfully.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('admin') // Only users with the "admin" role can delete workflows
  async deleteWorkflow(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.workflowService.deleteWorkflow(id);
    return { message: `Workflow with Id ${id} has been successfully deleted.` };
  }
}
