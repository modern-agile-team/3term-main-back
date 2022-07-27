import { ConfigModuleOptions } from '@nestjs/config';
import * as Joi from 'joi';

export const envConfig: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: [
    process.env.NODE_ENV === 'development' ? '.env.development' : '.env.test',
  ],
  ignoreEnvFile: process.env.NODE_ENV === 'production',
  validationSchema: Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production').required(),
    DB_PORT: Joi.number().required(),
    DB_TYPE: Joi.string().required(),
    DB_DATABASE: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_SYNCHRONIZE: Joi.boolean().required(),
    DB_LOGGING: Joi.boolean().required(),
    SERVER_PORT: Joi.number().required(),
    AWS_S3_ACCESS_KEY: Joi.string().required(),
    AWS_S3_SECRET_KEY: Joi.string().required(),
    AWS_S3_REGION: Joi.string().required(),
    AWS_S3_BUCKET_NAME: Joi.string().required(),
    SWAGGER_USER: Joi.string().required(),
    SWAGGER_PASSWORD: Joi.string().required(),
    SENTRY_DSN: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    EMAIL_AUTH_EMAIL: Joi.string().required(),
    EMAIL_AUTH_PASSWORD: Joi.string().required(),
    EMAIL_FROM_USER_NAME: Joi.string().required(),
    EMAIL_HOST: Joi.string().required(),
    EMAIL_PORT: Joi.string().required(),
    API_ACCESS_DOMAIN: Joi.string().required(),
    REFRESHTOCKEN_EXPIRES_IN: Joi.number().required(),
    EXPIRES_IN: Joi.number().required(),
  }),
};
