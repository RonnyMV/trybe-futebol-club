import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IMatches } from '../interfaces';

class MatchesController {
  constructor(private service: IMatches) {
    this.service = service;
  }

  async getAllMatches(_req: Request, res: Response, next: NextFunction) {
    try {
      const allMatches = await this.service.getAllMatches(null);
      return res.status(StatusCodes.OK).json(allMatches);
    } catch (error) {
      next(error);
    }
  }

  async createNewMatch(req: Request, res: Response, next: NextFunction) {
    try {
      const newMatch = await this.service.createNewMatch(req.body);
      return res.status(StatusCodes.CREATED).json(newMatch);
    } catch (error) {
      next(error);
    }
  }

  async updateMatch(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { userInfoToken, ...newBody } = req.body;
      const body = Object.keys(newBody).length > 0 ? newBody : { inProgress: false };
      const finished = await this.service.updateMatch(Number(id), body);
      return res.status(StatusCodes.OK).json(finished);
    } catch (error) {
      next(error);
    }
  }
}

export default MatchesController;
