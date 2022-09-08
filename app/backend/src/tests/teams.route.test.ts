import * as sinon from 'sinon';
import * as chai from 'chai';
import { before, after } from 'mocha';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import TeamsModels from '../database/models/TeamsModels';
import { Response } from 'superagent';
import { StatusCodes } from 'http-status-codes';

chai.use(chaiHttp);

const { expect } = chai;

const MESSAGE_TEAMS_NOT_FOUND = 'Teams not found';
const MESSAGE_TEAM_NOT_FOUND = 'Team not found';

let chaiHttpResponse: Response;

const TEAMS_MOCK = {
  id: 1,
  teamName: 'Avaí',
};

describe('Teste a rota teams com dados no banco de dados', () => {

  before(() => {
    return sinon
      .stub(TeamsModels, "findAll")
      .resolves([TEAMS_MOCK] as TeamsModels[]);
  });

  after(()=>{
    (TeamsModels.findAll as sinon.SinonStub).restore();
  })

  it('Teste se houver times cadastrados na rota retorna um array com id e nome do time', async () => {
    chaiHttpResponse = await chai
       .request(app).get('/teams');

    expect(chaiHttpResponse.status).to.be.equal(StatusCodes.OK);
    expect(chaiHttpResponse.body).to.be.eql([TEAMS_MOCK]);
  });
});

describe('Teste a rota teams sem dados no banco de dados', () => {

  before(() => {
    return sinon
      .stub(TeamsModels, "findAll")
      .resolves([]);
  });

  after(()=>{
    (TeamsModels.findAll as sinon.SinonStub).restore();
  })

  it('Teste se nao houver nenhum time cadastrado, lança uma exceção com status 404', async () => {

    try {
      chaiHttpResponse = await chai
         .request(app).get('/teams');  
    } catch (error) {
      expect(chaiHttpResponse.status).to.be.equal(StatusCodes.NOT_FOUND);
      expect(chaiHttpResponse.body.message).to.be.equal(MESSAGE_TEAMS_NOT_FOUND);    
    }    

  });
});

describe('Teste a rota teams/:id sem dados no banco de dados', () => {

  before(() => {
    return sinon
      .stub(TeamsModels, "findByPk")
      .resolves(null);
  });

  after(()=>{
    (TeamsModels.findByPk as sinon.SinonStub).restore();
  })

  it('Teste se nao houver nenhum time com o id informado, lança uma exceção com status 404', async () => {

    try {
      chaiHttpResponse = await chai
         .request(app).get('/teams/2');  
    } catch (error) {
      expect(chaiHttpResponse.status).to.be.equal(StatusCodes.NOT_FOUND);
      expect(chaiHttpResponse.body.message).to.be.equal(MESSAGE_TEAM_NOT_FOUND);    
    }
  });
});

describe('Teste a rota teams/:id com dados no banco de dados', () => {

  before(() => {
    return sinon
      .stub(TeamsModels, "findByPk")
      .resolves(TEAMS_MOCK as TeamsModels);
  });

  after(()=>{
    (TeamsModels.findByPk as sinon.SinonStub).restore();
  })

  it('Teste se nao houver nenhum time com o id informado, lança uma exceção com status 404', async () => {
      chaiHttpResponse = await chai
         .request(app).get('/teams/1'); 

      expect(chaiHttpResponse.status).to.be.equal(StatusCodes.OK);
      expect(chaiHttpResponse.body).to.be.eql(TEAMS_MOCK);    
  });
});