import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'PRODUCTS_MS',
        useFactory: (configService: ConfigService) => ({
            transport: Transport.RMQ,
          options: {
            urls: [
              `amqp://${configService.get('RABBITMQ_USER')}:${configService.get('RABBITMQ_PASS')}@${configService.get('RABBITMQ_HOST')}:${configService.get('RABBITMQ_PORT')}`,
            ],
            queue: configService.get('RABBITMQ_PRODUCTS_QUEUE', 'products_queue'),
            queueOptions: {
              durable: true
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ProductsController]
})
export class ProductsModule {}
