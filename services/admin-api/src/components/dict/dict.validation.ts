import { ValidationSchema } from '@nodite-light/admin-core';
import Joi from 'joi';

export const CreateGroupValidation: ValidationSchema = {
  body: Joi.object()
    .keys({
      groupId: Joi.forbidden(),
      groupKey: Joi.string().max(50).required(),
      groupName: Joi.string().max(50).required(),
    })
    .unknown(true),
};

export const UpdateGroupValidation: ValidationSchema = {
  body: Joi.object()
    .keys({
      groupId: Joi.forbidden(),
      groupKey: Joi.forbidden(),
      groupName: Joi.string().max(50).optional(),
    })
    .unknown(true),
};

export const CreateTypeValidation: ValidationSchema = {
  body: Joi.object()
    .keys({
      dictId: Joi.forbidden(),
      dictKey: Joi.string().max(50).required(),
      dictName: Joi.string().max(50).optional(),
      dictStyle: Joi.string().max(50).optional(),
    })
    .unknown(true),
};

export const UpdateTypeValidation: ValidationSchema = {
  body: Joi.object()
    .keys({
      dictId: Joi.forbidden(),
      dictKey: Joi.forbidden(),
      dictName: Joi.string().max(50).optional(),
      dictStyle: Joi.string().max(50).optional(),
    })
    .unknown(true),
};

export const CreateItemValidation: ValidationSchema = {
  body: Joi.object()
    .keys({
      itemId: Joi.forbidden(),
      dictKey: Joi.string().max(50).required(),
      itemKey: Joi.string().max(50).required(),
      itemValue: Joi.string().max(100).optional().allow(''),
    })
    .unknown(true),
};

export const UpdateItemValidation: ValidationSchema = {
  body: Joi.object()
    .keys({
      itemId: Joi.forbidden(),
      dictKey: Joi.forbidden(),
      itemKey: Joi.forbidden(),
      itemValue: Joi.string().max(100).optional().allow(''),
    })
    .unknown(true),
};
