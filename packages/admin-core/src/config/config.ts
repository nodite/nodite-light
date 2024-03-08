import Joi from 'joi';

// All env variables used by the app should be defined in this file.

// To define new env:
// 1. Add env variable to .env.local file;
// 2. Provide validation rules for your env in envsSchema;
// 3. Make it visible outside of this module in export section;
// 4. Access your env variable only via config file.
// Do not use process.env object outside of this file.

const envsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development').required(),
    PORT: Joi.number().default(8080),
    API_ROOT_PATH: Joi.string().required(),
    API_KEY_TOKEN: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES_IN: Joi.number().default(3600),
    // TODO: multiple db engine.
    DB_ENGINE: Joi.string().default('mysql').valid('mysql'),
    DB_NAME: Joi.string().default('nodite'),
    DB_USER: Joi.string().default('root'),
    DB_PASS: Joi.string().default('nodite'),
    DB_HOST: Joi.string().default('localhost'),
    DB_PORT: Joi.number().default(3306),
    REDIS_URL: Joi.string().default('redis://localhost:6379'),
    REDIS_USER: Joi.string().allow(null, ''),
    REDIS_PASS: Joi.string().allow(null, ''),
  })
  .unknown(true);

const { value: envVars, error } = envsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(
    `Config validation error: ${error.message}. \n
     This app requires env variables to work properly. If you run app locally use docker-compose`,
  );
}

// map env vars and make it visible outside module
export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  apiRootPath: envVars.API_ROOT_PATH,
  xApiKey: envVars.API_KEY_TOKEN,
  jwtSecret: envVars.JWT_SECRET,
  jwtExpiresIn: envVars.JWT_EXPIRES_IN,
  dbEngine: envVars.DB_ENGINE,
  dbName: envVars.DB_NAME,
  dbUser: envVars.DB_USER,
  dbPass: envVars.DB_PASS,
  dbHost: envVars.DB_HOST,
  dbPort: envVars.DB_PORT,
  redisUrl: envVars.REDIS_URL,
  redisUser: envVars.REDIS_USER,
  redisPass: envVars.REDIS_PASS,
};
