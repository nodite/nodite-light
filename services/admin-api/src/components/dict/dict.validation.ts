import { ValidationSchema } from '@nodite-light/admin-core';
import Joi from 'joi';

export const CreateGroupValidation: ValidationSchema = {
  body: Joi.object()
    .keys({
      groupId: Joi.forbidden(),
      groupName: Joi.string().required().max(50),
      groupKey: Joi.string().required().max(50),
      orderNum: Joi.number().optional().max(9999),
      parentId: Joi.string().optional().allow('', null),
    })
    .unknown(true),
};

export const UpdateGroupValidation: ValidationSchema = {
  body: Joi.object()
    .keys({
      groupId: Joi.forbidden(),
      groupName: Joi.string().required().max(50),
      groupKey: Joi.forbidden(),
      orderNum: Joi.number().optional().max(9999),
      parentId: Joi.string().optional().allow('', null),
    })
    .unknown(true),
};

export default {};
