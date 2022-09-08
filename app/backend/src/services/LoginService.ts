import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { StatusCodes } from 'http-status-codes';
import * as jwt from 'jsonwebtoken';
import UsersModel from '../database/models/UsersModel';
import { ILoginRepository, ILoginService } from '../interfaces/index';
import ErrorMiddleware from '../utils/error';

dotenv.config();

const secretKey: string = process.env.JWT_SECRET
    || 'un-Y&RyAHU-G_jN4Dzp%ydTJLdMzr8MwZSjG';

class LoginService implements ILoginService {
  constructor(private model: ILoginRepository) {
    this.model = model;
  }

  static generateToken({ ...payload }): string {
    return jwt.sign(payload, secretKey, {
      expiresIn: '3650d',
      algorithm: 'HS256',
    });
  }

  async login(email:string, password:string): Promise<UsersModel | null> {
    const userExists = await this.model.login(email);
    if (!userExists || userExists.email !== email) {
      throw new ErrorMiddleware(StatusCodes.UNAUTHORIZED, 'Incorrect email or password');
    }
    const comparePassword = await bcrypt.compare(password, userExists.password as string);
    if (!comparePassword) {
      throw new ErrorMiddleware(StatusCodes.UNAUTHORIZED, 'Incorrect email or password');
    }
    const { password: trashPassword, ...payload } = userExists;
    const token = LoginService.generateToken(payload);
    return token as unknown as UsersModel;
  }

  async loginValidate(id: number): Promise<UsersModel | null> {
    const userExists = await this.model.loginById(id);
    if (!userExists) {
      throw new ErrorMiddleware(StatusCodes.BAD_REQUEST, 'User Not Exists');
    }
    return userExists.role as unknown as UsersModel;
  }
}

export default LoginService;
