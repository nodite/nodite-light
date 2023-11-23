import { ValidationSchema } from '@core/interfaces/validationSchema';
import Joi from 'joi';

const createUserValidation: ValidationSchema = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email(),
  }),
};

export default createUserValidation;
