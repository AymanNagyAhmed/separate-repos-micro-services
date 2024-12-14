import { Module } from '@nestjs/common';
import { ProductsService } from '@/modules/products/products.service';
import { ProductsController } from '@/modules/products/products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@/modules/products/entities/product.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    ClientsModule.registerAsync([
      {
        name: 'PRODUCTS_MS',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              `amqp://${configService.get('RABBITMQ_USER')}:${configService.get('RABBITMQ_PASS')}@${configService.get('RABBITMQ_HOST')}:${configService.get('RABBITMQ_PORT')}`,
            ],
            queue: configService.get('RABBITMQ_QUEUE', 'products_queue'),
            queueOptions: { 
              durable: true 
            },
          },
        }),
        inject: [ConfigService],
      },
      // TODO: Add notifications, orders, payments, inventory, shipping
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
