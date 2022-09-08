import { NextFunction, Request, Response } from 'express';
import ErrorMiddleware from '../utils/error';

const errorMiddleware = (
  error: ErrorMiddleware,
  _req:Request,
  res:Response,
  _next: NextFunction,
) => res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' });

export default errorMiddleware;
