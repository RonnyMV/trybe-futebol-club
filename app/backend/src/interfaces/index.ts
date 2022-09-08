import MatchesModel from '../database/models/MatchesModels';
import TeamsModels from '../database/models/TeamsModels';
import UsersModel from '../database/models/UsersModel';

export interface ILoginRepository extends Partial<UsersModel> {
  password?: string,
  token?: string,
  login(email: string): Promise<UsersModel | null>
  loginById(id: number): Promise<UsersModel | null>
}

export interface ILoginService {
  login(email: string, password: string): Promise<UsersModel | null>;
  loginValidate(id: number): Promise<UsersModel | null>;
}

export interface ITeam {
  id: number,
  teamName: string,
}

export interface ITeams {
  getAllTeams(): Promise<TeamsModels[]>;
  getTeamById(id: number): Promise<TeamsModels | null>;
}

export interface IMatch {
  id?: number;
  homeTeam: number;
  awayTeam: number;
  homeTeamGoals: number;
  awayTeamGoals: number;
  inProgress?: boolean;
  length?: number;
}

export interface IMatches extends Partial<MatchesModel> {
  teamHome?: {
    teamName: string
  },
  teamAway?: {
    teamName: string
  }
  getAllMatches(payload: object | null): Promise<IMatch[]>;
  createNewMatch(match: IMatch): Promise<IMatch | null>;
  getMatchesByTeam(id: number, matchAttribute: string | number | null): Promise<IMatch[]>;
  getMatchById(id: number): Promise<MatchesModel | null>;
  updateMatch(id: number, data: Partial<IMatch>): Promise<void | null>;
}

export interface ILeaderBoard {
  totalPoints: number,
  totalGames: number,
  totalVictories: number,
  totalDraws: number,
  totalLosses: number,
  goalsFavor: number,
  goalsOwn: number,
  goalsBalance: number,
  efficiency: string,
}

export interface ILeaderBoards extends Partial<ILeaderBoard> {
  createLeaderBoard(matchAttribute: string | number): Promise<ILeaderBoard | null>
  createLeaderBoardGeneral(): Promise<ILeaderBoard | null>
}

export interface ILoginSchema {
  email: string
  password: string
}
