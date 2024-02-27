import { ValidationSchema } from '@nodite-light/admin-core';
import Joi from 'joi';

import { MenuType } from '@/components/menu/menu.interface';

/**
 * CreateValidation.
 */
export const CreateValidation: ValidationSchema = {
  body: Joi.object()
    .keys({
      menuId: Joi.forbidden(),
      menuName: Joi.string().max(50).required(),
      iType: Joi.string()
        .required()
        .allow(...MenuType),
      path: Joi.string().max(100).optional().allow(''),
      redirect: Joi.string().max(100).optional().allow(''),
      component: Joi.string().max(100).optional().allow(''),
    })
    .unknown(true),
};

/**
 * UpdateValidation.
 */
export const UpdateValidation: ValidationSchema = {
  body: Joi.object()
    .keys({
      menuId: Joi.forbidden(),
      menuName: Joi.string().max(50).optional(),
      iType: Joi.string()
        .optional()
        .allow(...MenuType),
      path: Joi.string().max(100).optional().allow(''),
      redirect: Joi.string().max(100).optional().allow(''),
      component: Joi.string().max(100).optional().allow(''),
    })
    .unknown(true),
};
