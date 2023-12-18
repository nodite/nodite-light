import { ValidationSchema } from '@nodite-light/admin-core/lib/interfaces/validationSchema';
import Joi from 'joi';

/**
 * LoginBodyValidation.
 */
export const LoginBodyValidation: ValidationSchema = {
  body: Joi.object()
    .keys({
      username: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string().required(),
    })
    .xor('username', 'email'),
};

/**
 * RegisterBodyValidation.
 */
export const RegisterBodyValidation: ValidationSchema = {
  body: Joi.object().keys({
    username: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().required(),
  }),
};
