import { IsString, IsOptional, IsObject, IsNumber, IsIn } from 'class-validator';

export class CreateNodeDto {
  @IsString({message: 'Node type must be a string.'})
  @IsIn(['start', 'end', 'condition', 'wait'], {message: 'Node type must be either "start", "end", "condition", or "wait".'})
  type: 'start' | 'end' | 'condition' | 'wait'; // Node type

  @IsOptional()
  @IsObject({message: 'Configuration must be a valid object'})
  configuration?: Record<string, any>; // Node-specific configuration

  @IsOptional()
  @IsNumber({}, {message: 'Next Node ID must be a number.'})
  nextNodeId?: number; // ID of the next node in sequence
}
