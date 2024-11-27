import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet'; // Use the default export
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Create NestJS application
  const app = await NestFactory.create(AppModule);

  // Enable CORS for both REST API and WebSocket communication
  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:3000'], // Add frontend or WebSocket origin(s)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Apply security best practices using Helmet
  app.use(helmet());

  // Apply global validation pipe for incoming requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unwanted properties
      forbidNonWhitelisted: true, // Reject requests with unknown properties
      transform: true, // Automatically transform payloads to DTO classes
    }),
  );

  // Apply global HTTP exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Set up Swagger for API documentation
  const config = new DocumentBuilder()
    .setTitle('Workflow Engine API')
    .setDescription('API documentation for the Workflow Engine')
    .setVersion('1.0')
    .addBearerAuth() // Add JWT authentication to Swagger
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger UI available at /api

  // Log application initialization
  logger.log('Initializing application...');

  // Listen on all interfaces (0.0.0.0) to allow external connections
  await app.listen(3000, '0.0.0.0');
  logger.log('Application is running on http://localhost:3000');
}
bootstrap();
