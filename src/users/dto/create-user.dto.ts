// src/users/dto/create-user.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsEnum, Length, Matches } from 'class-validator';
import { UserRole } from '../user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({message:'Username must not be empty.'})
  @Length(4, 20,{message: 'Username must be between 4 to 20 characters.'})
  username: string;

  @IsString()
  @IsNotEmpty({message: 'Password must not be empty.'})
  @Length(8, 20, {message: 'Password must be between 9 and 20 characters.'})
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  password: string;

  @IsOptional()
  @IsString()
  @IsEnum(UserRole, { message: 'Role must be either "admin" or "user"' })
  role?: UserRole; // Allow the role property
}
