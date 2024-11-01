import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<UserRole>('role', context.getHandler());
    if (!requiredRole) return true;

    const { user } = context.switchToHttp().getRequest();
    return user?.role === requiredRole;
  }
}
