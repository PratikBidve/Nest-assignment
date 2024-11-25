import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Retrieve all users.
   * @returns An array of all users.
   */
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * Retrieve a single user by ID.
   * @param id - The ID of the user to find.
   * @returns The user with the specified ID.
   * @throws NotFoundException if the user does not exist.
   */
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Retrieve a user by username.
   * @param username - The username to search for.
   * @returns The user with the specified username.
   * @throws NotFoundException if the user does not exist.
   */
  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(`User with username "${username}" not found`);
    }
    return user;
  }

  /**
   * Create a new user.
   * @param createUserDto - The user data for the new user.
   * @returns The created user.
   * @throws ConflictException if the username already exists.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (existingUser) {
      throw new ConflictException(
        `Username "${createUserDto.username}" already exists`,
      );
    }
    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }

  /**
   * Update an existing user.
   * @param id - The ID of the user to update.
   * @param updateUserDto - Partial data for updating the user.
   * @returns The updated user.
   * @throws NotFoundException if the user does not exist.
   */
  async update(id: number, updateUserDto: Partial<User>): Promise<User> {
    const user = await this.findOne(id); // Ensures user exists
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  /**
   * Delete a user by ID.
   * @param id - The ID of the user to delete.
   * @throws NotFoundException if the user does not exist.
   */
  async delete(id: number): Promise<void> {
    const user = await this.findOne(id); // Ensures user exists
    await this.usersRepository.remove(user);
  }
}
