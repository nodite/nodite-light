import { ValidationSchema } from '@core/interfaces/validationSchema';
import Joi from 'joi';

export const LoginBodyValidation: ValidationSchema = {
  body: Joi.object()
    .keys({
      username: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string().required(),
    })
    .xor('username', 'email'),
};

export default LoginBodyValidation;
