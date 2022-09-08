import { Router } from 'express';
import Repository from '../repositoryModel/MatchesRepository';
import Service from '../services/LeaderBoardService';
import Controller from '../controllers/LeaderBoardController';

const entityFactory = () => {
  const repository = new Repository();
  const service = new Service(repository);
  const controller = new Controller(service);
  return controller;
};

const LeaderBoardRouter: Router = Router();

LeaderBoardRouter.get('/leaderboard/home', (req, res, next) => {
  entityFactory().createLeaderBoard(req, res, next);
});

LeaderBoardRouter.get('/leaderboard/away', (req, res, next) => {
  entityFactory().createLeaderBoard(req, res, next);
});

LeaderBoardRouter.get('/leaderboard', (req, res, next) => {
  entityFactory().createLeaderBoardGeneral(req, res, next);
});

export default LeaderBoardRouter;
