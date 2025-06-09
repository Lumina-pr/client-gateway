import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  NATS_SERVERS: string[];
  SESSIONS_SECRET: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
    SESSIONS_SECRET: joi.string().required(),
    REDIS_HOST: joi.string().required(),
    REDIS_PORT: joi.number().default(6379),
    REDIS_PASSWORD: joi.string().allow(''),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
  PORT: parseInt(process.env.PORT || '3000', 10),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  nats: {
    servers: envVars.NATS_SERVERS,
  },
  sessions: {
    secret: envVars.SESSIONS_SECRET,
  },
  redis: {
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT,
    password: envVars.REDIS_PASSWORD || undefined,
  },
};
