import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare the given password with the stored hash
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const { password, ...result } = user; // Remove password before returning
      return result;
    } else {
      console.log('Password does not match during validation');
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUserDto = { ...createUserDto, password: hashedPassword };
    return this.usersService.create(newUserDto);
  }
}
