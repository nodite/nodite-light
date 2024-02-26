import { ValidationSchema } from '@nodite-light/admin-core';
import Joi from 'joi';

export const CreateGroupValidation: ValidationSchema = {
  body: Joi.object()
    .keys({
      groupId: Joi.forbidden(),
      groupName: Joi.string().required().max(50),
      groupKey: Joi.string().required().max(50),
      orderNum: Joi.number().optional().max(9999),
    })
    .unknown(true),
};

export const UpdateGroupValidation: ValidationSchema = {
  body: Joi.object()
    .keys({
      groupId: Joi.forbidden(),
      groupName: Joi.string().optional().max(50),
      groupKey: Joi.forbidden(),
      orderNum: Joi.number().optional().max(9999),
    })
    .unknown(true),
};

export const CreateTypeValidation: ValidationSchema = {
  body: Joi.object()
    .keys({
      dictId: Joi.forbidden(),
      dictName: Joi.string().optional().max(50),
      dictType: Joi.string().optional().max(32),
      dictKey: Joi.string().required().max(50),
      orderNum: Joi.number().optional().max(9999),
    })
    .unknown(true),
};

export const UpdateTypeValidation: ValidationSchema = {
  body: Joi.object()
    .keys({
      dictId: Joi.forbidden(),
      dictName: Joi.string().optional().max(50),
      dictType: Joi.string().optional().max(32),
      dictKey: Joi.forbidden(),
      orderNum: Joi.number().optional().max(9999),
    })
    .unknown(true),
};
