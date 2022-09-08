import * as sinon from 'sinon';
import * as chai from 'chai';
import { before, after } from 'mocha';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import UsersModel from '../database/models/UsersModel';

import { Response } from 'superagent';
import { StatusCodes } from 'http-status-codes';

chai.use(chaiHttp);

const { expect } = chai;

let chaiHttpResponse: Response;

const LOGIN_USER_MOCK = {
  id: 2,
  username: 'User',
  role: 'user',
  email: 'user@user.com',
  password: '$2a$08$Y8Abi8jXvsXyqm.rmp0B.uQBA5qUz7T6Ghlg/CvVr/gLxYj5UAZVO'
}

const MESSAGE_EMAIL_INVALID = '"email" must be a valid email';
const MESSAGE_PASSWORD_INVALID = '"password" length must be at least 6 characters long';
const MESSAGE_FIELDS_FILLED = 'All fields must be filled';
const UNAUTHORIZED = 'Incorrect email or password';
const TOKEN_NOT_FOUND = 'Token not found';
const USER_NOT_EXISTS = 'User not Exists';
const INVALID_TOKEN = 'Token must be a valid token';


describe('Teste a rota de login', () => {

  before(() => {
    sinon
      .stub(UsersModel, "findOne")
      .resolves(LOGIN_USER_MOCK as UsersModel);
  });

  after(()=>{
    (UsersModel.findOne as sinon.SinonStub).restore();
  })

  it('Teste se ao logar sem email retorna status 400 e mensagem "All fields must be filled"', async () => {
    chaiHttpResponse = await chai
       .request(app).post('/login').send({
        'password': 'secret_user',
       });

    expect(chaiHttpResponse.status).to.be.equal(StatusCodes.BAD_REQUEST);
    expect(chaiHttpResponse.body.message).to.be.equal(MESSAGE_FIELDS_FILLED);
  });

  it('Teste se ao logar com email com valor undefined retorna 400 e mensagem "All fields must be filled"', async () => {
    chaiHttpResponse = await chai
       .request(app).post('/login').send({
        'email': '',
        'password': 'secret_user',
       });

    expect(chaiHttpResponse.status).to.be.equal(StatusCodes.BAD_REQUEST);
    expect(chaiHttpResponse.body.message).to.be.equal(MESSAGE_FIELDS_FILLED);
  });

  it('Teste se ao logar sem password retorna status 400 e mensagem "All fields must be filled"', async () => {
    chaiHttpResponse = await chai
       .request(app).post('/login').send({
        'email': '',
        'password': 'secret_user',
       });

    expect(chaiHttpResponse.status).to.be.equal(StatusCodes.BAD_REQUEST);
    expect(chaiHttpResponse.body.message).to.be.equal(MESSAGE_FIELDS_FILLED);
  });

  it('Teste se ao logar com password com valor undefined retorna status 400 e mensagem "All fields must be filled"', async () => {
    chaiHttpResponse = await chai
       .request(app).post('/login').send({
        'email': '',
        'password': 'secret_user',
       });

    expect(chaiHttpResponse.status).to.be.equal(StatusCodes.BAD_REQUEST);
    expect(chaiHttpResponse.body.message).to.be.equal(MESSAGE_FIELDS_FILLED);
  });

  it('Teste se ao logar com email no formato invalido retorna 422 e "email" must be a valid email ', async () => {
    chaiHttpResponse = await chai
       .request(app).post('/login').send({
        'email': 'useruser.com',
        'password': 'secret_user',
       });

    expect(chaiHttpResponse.status).to.be.equal(StatusCodes.UNPROCESSABLE_ENTITY);
    expect(chaiHttpResponse.body.message).to.be.equal(MESSAGE_EMAIL_INVALID);
  });

  it('Teste se ao logar com passsword com menos de 6 caracteres retorna 400 e a mensagem "password" length must be at least 6 characters long ', async () => {
    chaiHttpResponse = await chai
       .request(app).post('/login').send({
        'email': 'user@user.com',
        'password': 'secr',
       });

    expect(chaiHttpResponse.status).to.be.equal(StatusCodes.UNPROCESSABLE_ENTITY);
    expect(chaiHttpResponse.body.message).to.be.equal(MESSAGE_PASSWORD_INVALID);
  });

  it('Teste se ao logar com usuario nao existente no banco de dados retorna 401 e mensagem "Incorrect email or password', async () => {
    try {
      chaiHttpResponse = await chai
         .request(app).post('/login').send({
          "email": "use@user.com",
          "password": "secret_user"
        });
      } catch (error) {
        expect(chaiHttpResponse.status).to.be.equal(StatusCodes.UNAUTHORIZED);
        expect(chaiHttpResponse.body.message).to.be.equal(UNAUTHORIZED)
      }
  });

  it('Teste se ao logar com usuario existente porem com uma senha invalida retorna 401 e mensagem "Incorrect email or password', async () => {
    try {
      chaiHttpResponse = await chai
         .request(app).post('/login').send({
          "email": "user@user.com",
          "password": "secret_use"
        });
      } catch (error) {
        expect(chaiHttpResponse.status).to.be.equal(StatusCodes.UNAUTHORIZED);
        expect(chaiHttpResponse.body.message).to.be.equal(UNAUTHORIZED)
      }
  });

  it('Teste se ao logar com sucesso retorna status 200 e a chave token', async () => {
        chaiHttpResponse = await chai
           .request(app).post('/login').send({
            "email": "user@user.com",
            "password": "secret_user"
          });

    expect(chaiHttpResponse).to.have.status(StatusCodes.OK);
    expect(chaiHttpResponse.body).to.have.property('token');
  });
});

describe('Teste a rota de login/validate', () => {

  before(() => {
    sinon
      .stub(UsersModel, "findByPk")
      .resolves(LOGIN_USER_MOCK as UsersModel);
  });

  after(()=>{
    (UsersModel.findByPk as sinon.SinonStub).restore();
  })

  it('Teste se ao logar sem token retorna status 401 com a mensagem Token not found', async () => {

    chaiHttpResponse = await chai
       .request(app).get('/login/validate').set('Authorization', '');

       expect(chaiHttpResponse.status).to.be.equal(StatusCodes.UNAUTHORIZED);
       expect(chaiHttpResponse.body.message).to.be.equal(TOKEN_NOT_FOUND);
  });

  it('Teste se ao logar com um token inválido retorna status 401 com a mensagem Token must be a valid token', async () => {

    chaiHttpResponse = await chai
       .request(app).get('/login/validate').set('Authorization', 'token');

       expect(chaiHttpResponse.status).to.be.equal(StatusCodes.UNAUTHORIZED);
       expect(chaiHttpResponse.body.message).to.be.equal(INVALID_TOKEN);
  });

  it('Teste se ao logar sem password retorna status 400 e mensagem "User not Exists"', async () => {

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbiIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjU3NTgyNTA1LCJleHAiOjE5NzI5NDI1MDV9.aqK4yXS8kSrdigIlbIKRe2O3M2EhXWGV_0mjGZMGZyQ"

    try {
      chaiHttpResponse = await chai
      .request(app).get('/login/validate').set('Authorization', token);    
    } catch (error) {
      expect(chaiHttpResponse.status).to.be.equal(StatusCodes.BAD_REQUEST);
      expect(chaiHttpResponse.body.message).to.be.equal(USER_NOT_EXISTS)
    }
  });

  it('Teste se ao logar com token válido retorna status 200 com a role do usuario logado', async () => {

    const token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJVc2VyIiwiZW1haWwiOiJ1c2VyQHVzZXIuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE2NTc1ODE5NDAsImV4cCI6MTY2MDE3Mzk0MH0.VL0V8-Y-1QxcSmm5qIsn-r7S51YmKpd6yXuTQevC3X8";

    chaiHttpResponse = await chai
       .request(app).get('/login/validate').set('Authorization', token);
  
    expect(chaiHttpResponse.status).to.be.equal(StatusCodes.OK);
    expect(chaiHttpResponse.body).to.have.property('role');
  });

});
