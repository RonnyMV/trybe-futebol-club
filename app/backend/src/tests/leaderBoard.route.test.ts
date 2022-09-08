import * as chai from 'chai';
import { StatusCodes } from 'http-status-codes';
import { after, before } from 'mocha';
import * as sinon from 'sinon';
import { Response } from 'superagent';
import { app } from '../app';
import MatchesModel from '../database/models/MatchesModels';
import TeamsModels from '../database/models/TeamsModels';
import BOARD_HOME_MOCK, { ALL_MATCHES_HOME_MOCK, ALL_TEAM_MOCK } from './mocks';
// @ts-ignore
import chaiHttp = require('chai-http');

chai.use(chaiHttp);

const { expect } = chai;

let chaiHttpResponse: Response;

describe('Teste a rota get /leaderboard/home com dados no banco de dados', () => {

  before(() => {
    sinon
      .stub(TeamsModels, "findAll")
      .resolves(ALL_TEAM_MOCK);
  
      ALL_TEAM_MOCK.forEach((team: any) => {
          sinon.stub(MatchesModel, "findAll").resolves(ALL_MATCHES_HOME_MOCK)
        });          
  });

  after(()=>{
    (TeamsModels.findAll as sinon.SinonStub).restore();
    (MatchesModel.findAll as sinon.SinonStub).restore();
  })

  it('Teste se ao acessar a rota get/leaderboard/home , retorna status 200 e o quadro geral de pontos de cada time', async () => {
    chaiHttpResponse = await chai
       .request(app).get('/leaderboard/home').send('homeTeam');

    expect(chaiHttpResponse.status).to.be.equal(StatusCodes.OK);
    expect(chaiHttpResponse.body).to.be.eql(BOARD_HOME_MOCK);
  });
});
