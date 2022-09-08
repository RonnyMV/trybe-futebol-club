import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ILeaderBoards } from '../interfaces';

class LeaderBoardController {
  constructor(private service: ILeaderBoards) {
    this.service = service;
  }

  async createLeaderBoard(req: Request, res: Response, next: NextFunction) {
    try {
      const matchAttribute = req.originalUrl === '/leaderboard/home' ? 'homeTeam' : 'awayTeam';
      const leaderBoard = await this.service.createLeaderBoard(matchAttribute);
      return res.status(StatusCodes.OK).json(leaderBoard);
    } catch (error) {
      next(error);
    }
  }

  async createLeaderBoardGeneral(req: Request, res: Response, next: NextFunction) {
    try {
      const leaderBoard = await this.service.createLeaderBoardGeneral();
      return res.status(StatusCodes.OK).json(leaderBoard);
    } catch (error) {
      next(error);
    }
  }
}

export default LeaderBoardController;
