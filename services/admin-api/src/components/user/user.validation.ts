import { ValidationSchema } from '@nodite-light/admin-core';
import Joi from 'joi';

/**
 * CreateValidation.
 */
export const CreateValidation: ValidationSchema = {
  body: Joi.object()
    .keys({
      userId: Joi.forbidden(),
      username: Joi.string().required(),
      email: Joi.string().email(),
      password: Joi.string().required(),
    })
    .unknown(true),
};

/**
 * EditValidation.
 */
export const EditValidation: ValidationSchema = {
  body: Joi.object()
    .keys({
      userId: Joi.forbidden(),
      username: Joi.forbidden(),
      email: Joi.string().email().optional().allow(''),
      password: Joi.forbidden(),
    })
    .unknown(true),
};

/**
 * ResetPasswordValidation.
 */
export const ResetPasswordValidation: ValidationSchema = {
  body: Joi.object().keys({
    password: Joi.string().required(),
    confirmPassword: Joi.string().required().equal(Joi.ref('password')),
  }),
};

export default {};
