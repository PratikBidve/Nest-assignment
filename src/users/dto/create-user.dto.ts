// src/users/dto/create-user.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  @IsEnum(UserRole, { message: 'Role must be either "admin" or "user"' })
  role?: UserRole; // Allow the role property
}
