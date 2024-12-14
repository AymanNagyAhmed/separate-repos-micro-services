import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { createCorsConfig } from '@/config/cors.config';
import { GlobalExceptionFilter } from '@/common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  
  // Get RabbitMQ configuration
  const rabbitmqUser = configService.get<string>('RABBITMQ_USER');
  const rabbitmqPass = configService.get<string>('RABBITMQ_PASS');
  const rabbitmqHost = configService.get<string>('RABBITMQ_HOST');
  const rabbitmqPort = configService.get<string>('RABBITMQ_PORT');
  
  const rabbitmqUrl = `amqp://${rabbitmqUser}:${rabbitmqPass}@${rabbitmqHost}:${rabbitmqPort}`;

  // Global prefix
  app.setGlobalPrefix('api');
  
  // CORS
  app.enableCors(createCorsConfig(configService));
  
  // Configure microservice
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqUrl],
      queue: configService.get<string>('RABBITMQ_QUEUE', 'products_queue'),
      queueOptions: {
        durable: true
      },
    },
  });
  
  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  // Global filters
  app.useGlobalFilters(new GlobalExceptionFilter());
  
  // Start microservice
  await app.startAllMicroservices();
  
  // Optional: Start HTTP server if needed
  const port = configService.get<number>('PORT', 4002);
  await app.listen(port);
  
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();