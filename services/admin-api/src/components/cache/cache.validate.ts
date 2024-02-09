import { ValidationSchema } from '@nodite-light/admin-core';
import Joi from 'joi';

export const CacheInvalidateValidation: ValidationSchema = {
  query: Joi.object()
    .keys({
      type: Joi.string().valid('all', 'menu', 'locale').required(),
    })
    .unknown(true),
};

export default {};
