import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';

export const createCorsConfig = (configService: ConfigService): CorsOptions => ({
  origin: (origin, callback) => {
    const allowedOrigins = configService.get<string>('FRONTEND_URLS', 'http://localhost:3000,htts://localhost:3000').split(',');
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: configService.get<string>('CORS_METHODS', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS').split(','),
  credentials: configService.get<boolean>('CORS_CREDENTIALS', true),
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: [
    'Accept',
    'Authorization',
    'Content-Type',
    'X-Requested-With',
    'Range',
    'Origin',
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 3600,
}); 