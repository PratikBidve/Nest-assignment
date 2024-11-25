import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventsGateway } from './events.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ConfigModule, // Ensure environment variables are accessible
    AuthModule, // Import AuthModule to provide JwtService
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule for JWT configuration
      inject: [ConfigService], // Inject ConfigService to access environment variables
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Get JWT_SECRET from environment
        signOptions: { expiresIn: '1h' }, // Set token expiration
      }),
    }),
  ],
  providers: [EventsGateway], // Register the WebSocket Gateway
  exports: [EventsGateway], // Export EventsGateway for use in other modules
})
export class EventsModule {}
