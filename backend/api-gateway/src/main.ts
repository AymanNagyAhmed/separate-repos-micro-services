import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  try {
    const logger = new Logger('Bootstrap');
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    
    const port = process.env.PORT || 4000;
    app.setGlobalPrefix('api');
    
    // More detailed CORS configuration
    app.enableCors({
      origin: process.env.NODE_ENV === 'development' ? '*' : process.env.FRONTEND_URLS.split(','),
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });

    await app.listen(port, '0.0.0.0');
    logger.log(`Application is running on: http://localhost:${port}`);
    logger.log(`Environment: ${process.env.NODE_ENV}`);
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();
