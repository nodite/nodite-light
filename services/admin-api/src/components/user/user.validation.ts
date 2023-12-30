import { ValidationSchema } from '@nodite-light/admin-core/lib/interfaces/validationSchema';
import Joi from 'joi';

/**
 * CreateUserValidation.
 */
export const CreateUserValidation: ValidationSchema = {
  body: Joi.object()
    .keys({
      username: Joi.string().required(),
      email: Joi.string().email(),
      password: Joi.string().required(),
    })
    .unknown(true),
};

/**
 * UpdateUserValidation.
 */
export const UpdateUserValidation: ValidationSchema = {
  body: Joi.object()
    .keys({
      username: Joi.forbidden(),
      email: Joi.string().email().optional().allow(null, ''),
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
