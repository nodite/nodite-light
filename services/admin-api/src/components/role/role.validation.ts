import { ValidationSchema } from '@nodite-light/admin-core';
import Joi from 'joi';

export const CreateValidation: ValidationSchema = {
  body: Joi.object()
    .keys({
      roleId: Joi.forbidden(),
      roleKey: Joi.string().required(),
    })
    .unknown(true),
};

export const EditValidation: ValidationSchema = {
  body: Joi.object()
    .keys({
      roleId: Joi.forbidden(),
      roleKey: Joi.forbidden(),
    })
    .unknown(true),
};

export default {};
