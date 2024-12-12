import { Module } from '@nestjs/common';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from '@/modules/users/users.controller';
import { ProductsController } from '@/modules/products/products.controller';
import { validationSchema } from '@/config/env.validation';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    ClientsModule.register([
      {
        name: 'USERS_MS',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'users_queue',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'PRODUCTS_MS',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'products_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [AppController, UsersController, ProductsController],
  providers: [AppService],

})
export class AppModule {}
