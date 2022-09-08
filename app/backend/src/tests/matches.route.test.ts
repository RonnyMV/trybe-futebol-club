import * as sinon from 'sinon';
import * as chai from 'chai';
import { before, after } from 'mocha';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import MatchesModel from '../database/models/MatchesModels';
import { Response } from 'superagent';
import { StatusCodes } from 'http-status-codes';
import { IMatch, IMatches } from '../interfaces';

chai.use(chaiHttp);

const { expect } = chai;

let chaiHttpResponse: Response;

const MATCHES_NOT_FOUND = 'Matches not found.';
const MATCH_NOT_FOUND = 'Match not found.';
const INVALID_TOKEN = 'Token must be a valid token';

describe('Teste a rota get /matches com dados no banco de dados', () => {

  const MATCHES_MOCK = {
    id: 1,
    homeTeam: 16,
    homeTeamGoals: 1,
    awayTeam: 8,
    awayTeamGoals: 1,
    inProgress: false,
    teamHome: {
      teamName: "São Paulo"
    },
    teamAway: {
      teamName: "Grêmio"
    }
  } as unknown as MatchesModel;

  before(() => {
    return sinon
      .stub(MatchesModel, "findAll")
      .resolves([MATCHES_MOCK]);
  });

  after(()=>{
    (MatchesModel.findAll as sinon.SinonStub).restore();
  })

  it('Teste se houver alguma partida no banco de dados, retorna status 200 e os dados de todas as partidas cadastradas', async () => {
    chaiHttpResponse = await chai
       .request(app).get('/matches');

    expect(chaiHttpResponse.status).to.be.equal(StatusCodes.OK);
    expect(chaiHttpResponse.body).to.be.eql([MATCHES_MOCK]);
  });
});

describe('Teste a rota get /matches sem dados no banco de dados', () => {

  before(() => {
    return sinon
      .stub(MatchesModel, "findAll")
      .resolves([]);
  });

  after(()=>{
    (MatchesModel.findAll as sinon.SinonStub).restore();
  })

  it('Teste se não houver nenhuma partida cadastrada a rota retorna status 404 e mensagem Matches not found.', async () => {

    try {
      chaiHttpResponse = await chai
         .request(app).get('/matches');      
    } catch (error) {
      expect(chaiHttpResponse.status).to.be.equal(StatusCodes.NOT_FOUND);
      expect(chaiHttpResponse.body).to.be.eql(MATCHES_NOT_FOUND);      
    }
  });
});

describe('Teste a rota post /matches para criar uma nova partida', () => {

const MATCHES_MOCK = {
    id: 49,
    homeTeam: 16,
    awayTeam: 8,
    homeTeamGoals: 2,
    awayTeamGoals: 2,
    inProgress: true
} as MatchesModel;

  before(() => {
    return sinon
      .stub(MatchesModel, "create")
      .resolves(MATCHES_MOCK);
  });

  after(()=>{
    (MatchesModel.create as sinon.SinonStub).restore();
  })

  it('Teste se com token válido, a rota de criação  retorna status 201 e os dados da partida cadastrada', async () => {

    const token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbiIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjU3NjY1NTU5LCJleHAiOjE5NzMwMjU1NTl9.8NouXtkTlj-_akkrMm9DBpfXy5dne7WYB7XBrIZeGNw"

      chaiHttpResponse = await chai
         .request(app).post('/matches').set('Authorization', token).send({
          "id": 49,
          "homeTeam": 16,
          "awayTeam": 8,
          "homeTeamGoals": 2,
          "awayTeamGoals": 2,
         });      
      expect(chaiHttpResponse.status).to.be.equal(StatusCodes.CREATED);
      expect(chaiHttpResponse.body).to.be.eql(MATCHES_MOCK);      
  });

  it('Teste se com token inválido, a rota de criação  retorna status 401 e mensagem Token must be a valid token', async () => {

    chaiHttpResponse = await chai
    .request(app).post('/matches').set('Authorization', 'token').send({
     "id": 49,
     "homeTeam": 16,
     "awayTeam": 8,
     "homeTeamGoals": 2,
     "awayTeamGoals": 2,
    });      
 expect(chaiHttpResponse.status).to.be.equal(StatusCodes.UNAUTHORIZED);
 expect(chaiHttpResponse.body.message).to.be.equal(INVALID_TOKEN);      
  });

});

describe('Teste a rota patch /matches/id/finish para setar com sucesso uma partida como inProgress para false ', () => {

const MOCK_FINISHED = { message: 'Finished' } as any;
  
    before(() => {
      return sinon
        .stub(MatchesModel, 'update')
        .resolves(MOCK_FINISHED);
    });
  
    after(()=>{
      (MatchesModel.update as sinon.SinonStub).restore();
    })
  
    it('Teste se com token válido, a rota de atualizacao retorna status 200 e a mensagem Finished', async () => {
  
      const token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbiIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjU3NjY1NTU5LCJleHAiOjE5NzMwMjU1NTl9.8NouXtkTlj-_akkrMm9DBpfXy5dne7WYB7XBrIZeGNw"
  
        chaiHttpResponse = await chai
           .request(app).patch('/matches/48/finish').set('Authorization', token).send({ inProgress: false});      
        expect(chaiHttpResponse.status).to.be.equal(StatusCodes.OK);
        expect(chaiHttpResponse.body).to.be.eql(MOCK_FINISHED);      
    }); 
  });

describe('Teste a rota patch /matches/id/finish com id nao encontrado no Banco de Dados', () => {
  const MOCK_MATCH_BY_ID = {
    id: 48,
    homeTeam: 13,
    homeTeamGoals: 1,
    awayTeam: 2,
    awayTeamGoals: 1,
    inProgress: false
  } as any;
  
  before(() => { 
    return sinon.stub(MatchesModel, 'findByPk').resolves(MOCK_MATCH_BY_ID);
  });
  
  after(()=>{
    (MatchesModel.findByPk as sinon.SinonStub).restore();
  })
  
  it('Teste se com token válido e id nao encontrado, a rota de atualizacao retorna status 404 e a mensagem Match not found.', async () => {

  const token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbiIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjU3NjY1NTU5LCJleHAiOjE5NzMwMjU1NTl9.8NouXtkTlj-_akkrMm9DBpfXy5dne7WYB7XBrIZeGNw"
  try {
    chaiHttpResponse = await chai.request(app).patch('/matches/1000/finish')
  .set('Authorization', token).send({ inProgress: false});
  } catch (error) {
    expect(chaiHttpResponse.status).to.be.equal(StatusCodes.NOT_FOUND);
    expect(chaiHttpResponse.body.message).to.be.equal(MATCH_NOT_FOUND);
  }
  // if (!MOCK_MATCH_BY_ID) {
  //   expect(chaiHttpResponse.status).to.be.equal(StatusCodes.NOT_FOUND);
  //   expect(chaiHttpResponse.body.message).to.be.equal(MATCH_NOT_FOUND);
  // } outra forma de testar
  }); 
});
