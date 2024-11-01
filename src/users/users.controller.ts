import { Controller, Get, Post, Body, Param, Delete, Put, Patch, UseGuards, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Import the guard
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@UseGuards(JwtAuthGuard) // Apply the guard to all routes in the controller
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: Partial<User>): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id')
  async partialUpdate(@Param('id') id: number, @Body() updateUserDto: Partial<User>): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<{ message: string }> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersService.delete(id);
    return { message: 'User has been deleted successfully' };
  }
}
