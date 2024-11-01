import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/user.entity';

export const Roles = (role: UserRole) => SetMetadata('role', role);