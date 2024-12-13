import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '@/modules/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from '@/modules/events/events.module';

import { UsersController } from '@/modules/users/users.controller';
import { validationSchema } from '@/config/env.validation';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const dbType = configService.get<string>('DB_TYPE');
        const dbUser = configService.get<string>('DB_USER');
        const dbPassword = configService.get<string>('DB_PASSWORD');
        const dbHost = configService.get<string>('DB_HOST');
        const dbPort = configService.get<string>('DB_PORT');
        const dbName = configService.get<string>('DB_NAME');

        const uri = `${dbType}://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?authSource=admin&retryWrites=true&w=majority&directConnection=true`;

        return {
          uri,
          autoCreate: true,
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

