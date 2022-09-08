import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ILoginService } from '../interfaces';

class LoginController {
  constructor(private service: ILoginService) {
    this.service = service;
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const token = await this.service.login(email, password);
      return res.status(StatusCodes.OK).json({ token });
    } catch (error) {
      next(error);
    }
  }

  async loginValidate(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.body.userInfoToken;
      const role = await this.service.loginValidate(id);
      return res.status(StatusCodes.OK).json({ role });
    } catch (error) {
      next(error);
    }
  }
}

export default LoginController;
