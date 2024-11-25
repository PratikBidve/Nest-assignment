import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get roles metadata from the endpoint
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true; // Get roles metadata from the endpoint

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Extract the user from the request
    return roles.includes(user.role); // Check if the user has one of the required roles
  }
}
