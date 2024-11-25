import { IsString, IsOptional, IsObject, IsNumber } from 'class-validator';

export class CreateNodeDto {
  @IsString()
  type: 'start' | 'end' | 'condition' | 'wait'; // Node type

  @IsOptional()
  @IsObject()
  configuration?: Record<string, any>; // Node-specific configuration

  @IsOptional()
  @IsNumber()
  nextNodeId?: number; // ID of the next node in sequence
}
