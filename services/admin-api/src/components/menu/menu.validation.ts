import { ValidationSchema } from '@nodite-light/admin-core';
import Joi from 'joi';

import { MenuType } from '@/components/menu/menu.interface';

/**
 * SaveValidation.
 */
export const SaveValidation: ValidationSchema = {
  body: Joi.object()
    .keys({
      menuId: Joi.forbidden(),
      menuName: Joi.string().required().max(50),
      orderNum: Joi.number().optional().max(9999),
      iType: Joi.string()
        .required()
        .allow(...MenuType),
      path: Joi.string().optional().max(200),
      component: Joi.string().optional().max(255),
    })
    .unknown(true),
};

export default {};
