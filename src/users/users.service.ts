import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { AuditService } from '../audit/audit.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly auditService: AuditService, // Inject AuditService
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(`User with username "${username}" not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (existingUser) {
      throw new ConflictException(
        `Username "${createUserDto.username}" already exists`
      );
    }

    // Create a new user and save it in the database
    const newUser = this.usersRepository.create(createUserDto);
    const savedUser = await this.usersRepository.save(newUser);

    // Log the user creation action
    await this.auditService.logAction('CREATE_USER', savedUser.id, {
      username: savedUser.username,
    });

    return savedUser;
  }

  async update(id: number, updateUserDto: Partial<User>): Promise<User> {
    const user = await this.findOne(id); // Ensures user exists

    // Handle potential username conflict
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.usersRepository.findOne({
        where: { username: updateUserDto.username },
      });

      if (existingUser) {
        throw new ConflictException(
          `Username "${updateUserDto.username}" already exists. Please use a different username.`
        );
      }
    }

    // If the update contains a password, hash it before saving
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.usersRepository.save(user);

    // Log the user update action
    await this.auditService.logAction('UPDATE_USER', updatedUser.id, {
      updatedFields: updateUserDto,
    });

    return updatedUser;
  }

  async delete(id: number): Promise<void> {
    const user = await this.findOne(id); // Ensures user exists

    // Log the user deletion action before removing the user from the database
    await this.auditService.logAction('DELETE_USER', id, {
      deletedUsername: user.username,
    });

    // Remove the user from the database
    await this.usersRepository.remove(user);
  }
}
