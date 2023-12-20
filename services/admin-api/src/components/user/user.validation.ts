import { ValidationSchema } from '@nodite-light/admin-core/lib/interfaces/validationSchema';
import Joi from 'joi';

/**
 * CreateUserValidation.
 */
export const CreateUserValidation: ValidationSchema = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().email(),
    password: Joi.string().required(),
  }),
};

export default CreateUserValidation;
