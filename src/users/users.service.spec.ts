import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AuditService } from '../audit/audit.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

const mockUsersRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
};

const mockAuditService = {
  logAction: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
        {
          provide: AuditService,
          useValue: mockAuditService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto = { username: 'JohnDoe', password: 'password123' };
    const mockUser = { id: 1, username: 'JohnDoe' };

    mockUsersRepository.findOne.mockResolvedValue(null); // No user conflict
    mockUsersRepository.create.mockReturnValue(createUserDto);
    mockUsersRepository.save.mockResolvedValue(mockUser);

    const result = await service.create(createUserDto);

    expect(result).toEqual(mockUser);
    expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
      where: { username: 'JohnDoe' },
    });
    expect(mockAuditService.logAction).toHaveBeenCalledWith(
      'CREATE_USER',
      mockUser.id,
      { username: 'JohnDoe' }
    );
  });

  it('should throw ConflictException when username exists', async () => {
    const createUserDto = { username: 'JohnDoe', password: 'password123' };
    const existingUser = { id: 1, username: 'JohnDoe' };

    mockUsersRepository.findOne.mockResolvedValue(existingUser);

    await expect(service.create(createUserDto)).rejects.toThrow(
      new ConflictException('Username "JohnDoe" already exists')
    );
  });

  it('should throw NotFoundException when user is not found', async () => {
    mockUsersRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne(1)).rejects.toThrow(
      new NotFoundException('User with ID 1 not found')
    );
  });
});
