import { ValidationSchema } from '@core/interfaces/validationSchema';
import Joi from 'joi';

export const CreateUserValidation: ValidationSchema = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().email(),
    password: Joi.string().required(),
  }),
};

export default CreateUserValidation;
