import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Application
  PORT: Joi.number().default(4000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  // CORS
  FRONTEND_URLS: Joi.string()
    .default('http://localhost:3000,http://localhost:3001')
    .description('Comma-separated list of allowed origins'),

  // RabbitMQ
  RABBITMQ_USER: Joi.string().required(),
  RABBITMQ_PASS: Joi.string().required(),
  RABBITMQ_URL: Joi.string().required(),
  RABBITMQ_QUEUE: Joi.string().required(),
  RABBITMQ_EXCHANGE: Joi.string().required(),
  RABBITMQ_ROUTING_KEY: Joi.string().required(),


}); 