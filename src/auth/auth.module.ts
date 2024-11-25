import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    UsersModule, // Import UsersModule for user-related services
    PassportModule, // Import Passport for authentication strategies
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule for environment variables
      inject: [ConfigService], // Inject ConfigService for dynamic configuration
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Fetch JWT secret from env
        signOptions: { expiresIn: '1h' }, // Token expiration time
      }),
    }),
  ],
  providers: [
    AuthService, // Service to handle authentication logic
    LocalStrategy, // Strategy for local authentication
    JwtStrategy, // Strategy for JWT authentication
    RolesGuard, // Guard for role-based authorization
  ],
  controllers: [AuthController], // Controller for authentication endpoints
  exports: [AuthService, JwtModule], // Export AuthService and JwtModule for use in other modules
})
export class AuthModule {}
