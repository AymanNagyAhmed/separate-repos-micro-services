import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '@/modules/users/users.module';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from '@/modules/events/events.module';
// @Module({
//   imports: [UsersModule],
//   controllers: [AppController],
//   providers: [AppService],
// })


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: (process.env.DB_TYPE as any) || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'admin',
      password: process.env.DB_PASSWORD || 'admin',
      database: process.env.DB_DATABASE || 'users_ms_db',
      autoLoadEntities: true,
      synchronize: true,
    }),

    ClientsModule.register([
      {
        name: 'PRODUCTS_MS',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: process.env.PRODUCTS_QUEUE || 'products_queue',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'SHARED_DATA_MS',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: process.env.SHARED_DATA_QUEUE || 'shared_data_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
    UsersModule,
    EventsModule,
  ],
})
export class AppModule {}

