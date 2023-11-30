import Joi from 'joi';

import pkjJson from '../../package.json';

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
    API_KEY_TOKEN: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    DB_NAME: Joi.string().optional().default('nodite'),
    DB_USER: Joi.string().optional().default('root'),
    DB_PASS: Joi.string().optional().default('nodite'),
    DB_HOST: Joi.string().optional().default('localhost'),
    DB_PORT: Joi.number().optional().default(3306),
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
  version: pkjJson.version,
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  xApiKey: envVars.API_KEY_TOKEN,
  jwtSecret: envVars.JWT_SECRET,
  dbName: envVars.DB_NAME,
  dbUser: envVars.DB_USER,
  dbPass: envVars.DB_PASS,
  dbHost: envVars.DB_HOST,
  dbPort: envVars.DB_PORT,
};
