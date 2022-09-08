import { Router } from 'express';
import Repository from '../repositoryModel/MatchesRepository';
import Service from '../services/MatchesService';
import Controller from '../controllers/MatchesController';
import validateAuth from '../middlewares/validateAuth';

const entityFactory = () => {
  const repository = new Repository();
  const service = new Service(repository);
  const controller = new Controller(service);
  return controller;
};

const MatchesRouter: Router = Router();

MatchesRouter.get('/matches', (req, res, next) => {
  entityFactory().getAllMatches(req, res, next);
});

MatchesRouter.post('/matches', validateAuth, (req, res, next) => {
  entityFactory().createNewMatch(req, res, next);
});

MatchesRouter.patch('/matches/:id/finish', validateAuth, (req, res, next) => {
  entityFactory().updateMatch(req, res, next);
});

MatchesRouter.patch('/matches/:id', validateAuth, (req, res, next) => {
  entityFactory().updateMatch(req, res, next);
});

export default MatchesRouter;
