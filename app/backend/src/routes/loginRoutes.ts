import { Router } from 'express';
import Repository from '../repositoryModel/LoginRepository';
import Service from '../services/LoginService';
import Controller from '../controllers/LoginController';
import valid from '../middlewares/OthersValidations';
import validateAuth from '../middlewares/validateAuth';

const entityFactory = () => {
  const repository = new Repository();
  const service = new Service(repository);
  const controller = new Controller(service);
  return controller;
};

const LoginRouter: Router = Router();

LoginRouter.post('/login', valid.validateLogin, (req, res, next) => {
  entityFactory().login(req, res, next);
});

LoginRouter.get('/login/validate', validateAuth, (req, res, next) => {
  entityFactory().loginValidate(req, res, next);
});

export default LoginRouter;
