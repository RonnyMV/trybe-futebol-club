import { Request, NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import valid from '../utils/schemas';

const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { body } = req;
  const validate = valid.schemaLogin.validate(body);

  if (validate.error) {
    const { type, message } = validate.error.details[0];
    if (type === 'any.required' || type === 'string.empty') {
      next({ status: StatusCodes.BAD_REQUEST, message });
    }
    next({ status: StatusCodes.UNPROCESSABLE_ENTITY, message });
  }
  next();
};

export default { validateLogin };
