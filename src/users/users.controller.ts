import {
  Controller,
  Get,
  Param,
  Delete,
  Put,
  Patch,
  UseGuards,
  NotFoundException,
  Body,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { User } from './user.entity';

@ApiTags('Users') // Swagger grouping for user endpoints
@ApiBearerAuth() // All endpoints in this controller require Bearer token authentication
@UseGuards(JwtAuthGuard) // Apply the guard to all routes in the controller
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Retrieve all users
   * @returns An array of all users
   */
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'A list of users',
    type: [User],
  })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  /**
   * Retrieve a single user by ID
   * @param id - The ID of the user to find
   * @returns The user with the specified ID
   * @throws NotFoundException if the user does not exist
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the user', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'The user with the specified ID',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: number): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Update an existing user
   * @param id - The ID of the user to update
   * @param updateUserDto - Partial data for updating the user
   * @returns The updated user
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update an existing user by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the user', type: 'number' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', description: 'New username for the user' },
        password: { type: 'string', description: 'New password for the user' },
        role: { type: 'string', description: 'Role for the user (e.g., admin, user)' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: User,
  })
  @ApiResponse({ status: 409, description: 'Conflict - Username already exists' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: Partial<User>,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Partially update an existing user
   * @param id - The ID of the user to update
   * @param updateUserDto - Partial data for updating the user
   * @returns The updated user
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Partially update an existing user by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the user', type: 'number' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', description: 'New username for the user' },
        password: { type: 'string', description: 'New password for the user' },
        role: { type: 'string', description: 'Role for the user (e.g., admin, user)' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: User,
  })
  @ApiResponse({ status: 409, description: 'Conflict - Username already exists' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async partialUpdate(
    @Param('id') id: number,
    @Body() updateUserDto: Partial<User>,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Delete a user by ID
   * @param id - The ID of the user to delete
   * @returns A success message upon successful deletion
   * @throws NotFoundException if the user does not exist
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the user', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User has been deleted successfully' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async delete(@Param('id') id: number): Promise<{ message: string }> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersService.delete(id);
    return { message: 'User has been deleted successfully' };
  }
}
