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
      menuName: Joi.string().required().max(50),
      orderNum: Joi.number().optional().max(9999),
      iType: Joi.string()
        .required()
        .allow(...MenuType),
      path: Joi.string().optional().max(200).allow(''),
      component: Joi.string().optional().max(255).allow(''),
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
      menuName: Joi.string().optional().max(50),
      orderNum: Joi.number().optional().max(9999),
      iType: Joi.string()
        .optional()
        .allow(...MenuType),
      path: Joi.string().optional().max(200).allow(''),
      component: Joi.string().optional().max(255).allow(''),
    })
    .unknown(true),
};
