import * as Joi from 'joi';
import { ILoginSchema } from '../interfaces';

const message = 'All fields must be filled';

const schemaLogin = Joi.object<ILoginSchema>({
  email: Joi.string().email().required().messages({
    'string.empty': message,
    'any.required': message,
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': message,
    'any.required': message,
  }),
});

export default { schemaLogin };
