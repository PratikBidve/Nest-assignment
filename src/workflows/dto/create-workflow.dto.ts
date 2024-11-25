import { IsString, IsArray, IsOptional, IsObject, IsNotEmpty } from 'class-validator';

export class CreateWorkflowDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsObject()
  definition: Record<string, any>; // JSON structure of the workflow

  @IsOptional()
  @IsArray()
  nodes: Array<{
    type: 'start' | 'end' | 'condition' | 'wait';
    configuration?: Record<string, any>;
    nextNodeId?: number;
  }>;
}
