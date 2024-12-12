import { RmqOptions, Transport } from '@nestjs/microservices';

export const rabbitMQConfig: RmqOptions = {
  transport: Transport.RMQ,
  options: {
    urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
    queue: 'users_queue',
    queueOptions: {
      durable: false,
    },
  },
};