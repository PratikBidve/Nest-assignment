import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';

@ApiTags('Auth') // Swagger grouping for authentication endpoints
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Register a new user
   * @param createUserDto - User registration details
   * @returns The created user
   */
  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'The ID of the created user' },
        username: { type: 'string', description: 'The username of the created user' },
        role: { type: 'string', description: 'The role assigned to the user (e.g., admin, user)' },
      },
    },
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  /**
   * Log in with valid credentials
   * @param req - Request containing user credentials
   * @returns JWT access token
   */
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Log in with username and password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', description: 'The username of the user' },
        password: { type: 'string', description: 'The password of the user', format: 'password' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string', description: 'JWT access token' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  /**
   * Get the profile of the currently logged-in user
   * @param req - Request containing authenticated user
   * @returns User profile details
   */
  @UseGuards(JwtAuthGuard, RolesGuard) // Protect this route with JWT and RBAC
  @Roles('user', 'admin') // Allow both "user" and "admin" roles
  @Get('profile')
  @ApiOperation({ summary: 'Get the profile of the current user (Requires user or admin role)' })
  @ApiBearerAuth() // Indicates that JWT authentication is required
  @ApiResponse({
    status: 200,
    description: 'Returns the profile of the authenticated user',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'The ID of the authenticated user' },
        username: { type: 'string', description: 'The username of the authenticated user' },
        role: { type: 'string', description: 'The role of the authenticated user' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  getProfile(@Request() req) {
    return req.user; // Ensure this contains the authenticated user's details
  }
}