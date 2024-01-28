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
 * LocaleUpdateValidation.
 */
export const LocaleUpdateValidation: ValidationSchema = {
  body: Joi.object()
    .keys({
      localeId: Joi.forbidden(),
    })
    .unknown(true),
};

export const SourceCreateValidation: ValidationSchema = {
  body: Joi.object()
    .keys({
      srcId: Joi.forbidden(),
      source: Joi.required(),
      locations: Joi.array()
        .items(
          Joi.object()
            .keys({
              lcId: Joi.forbidden(),
              srcId: Joi.forbidden(),
              type: Joi.string().required(),
            })
            .unknown(true),
        )
        .optional(),
    })
    .unknown(true),
};
