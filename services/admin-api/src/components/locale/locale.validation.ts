import { ValidationSchema } from '@nodite-light/admin-core';
import Joi from 'joi';

/**
 * LocaleCreateValidation.
 */
export const LocaleCreateValidation: ValidationSchema = {
  body: Joi.object()
    .keys({
      localeId: Joi.forbidden(),
    })
    .unknown(true),
};

/**
 * LocaleEditValidation.
 */
export const LocaleEditValidation: ValidationSchema = {
  body: Joi.object()
    .keys({
      localeId: Joi.forbidden(),
    })
    .unknown(true),
};
