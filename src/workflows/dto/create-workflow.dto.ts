// src/workflows/dto/create-workflow.dto.ts
import { IsString, IsArray, IsOptional, IsObject, IsNotEmpty, ValidateNested, IsIn, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class NodeDto {
  @IsString({ message: 'Node type must be a string.' })
  @IsIn(['start', 'end', 'condition', 'wait'], { message: 'Node type must be either "start", "end", "condition", or "wait".' })
  type: 'start' | 'end' | 'condition' | 'wait';

  @IsOptional()
  @IsObject({ message: 'Configuration must be a valid object.' })
  configuration?: Record<string, any>;

  @IsOptional()
  @IsNumber({}, { message: 'Next Node ID must be a number.' })
  nextNodeId?: number;
}

export class CreateWorkflowDto {
  @IsString()
  @IsNotEmpty({ message: 'Workflow name must not be empty.' })
  name: string;

  @IsObject({ message: 'Workflow definition must be a valid object.' })
  @IsNotEmpty({ message: 'Workflow definition must not be empty.' })
  definition: Record<string, any>; // JSON structure of the workflow

  @IsOptional()
  @IsArray({ message: 'Nodes must be an array.' })
  @ValidateNested({ each: true })
  @Type(() => NodeDto)
  nodes: NodeDto[];
}
