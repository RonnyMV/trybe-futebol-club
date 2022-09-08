import { Router } from 'express';
import Repository from '../repositoryModel/TeamsRepository';
import Service from '../services/TeamsService';
import Controller from '../controllers/TeamsController';

const entityFactory = () => {
  const repository = new Repository();
  const service = new Service(repository);
  const controller = new Controller(service);
  return controller;
};

const TeamsRouter: Router = Router();

TeamsRouter.get('/teams', (req, res, next) => {
  entityFactory().getAllTeams(req, res, next);
});

TeamsRouter.get('/teams/:id', (req, res, next) => {
  entityFactory().getTeamById(req, res, next);
});

export default TeamsRouter;
