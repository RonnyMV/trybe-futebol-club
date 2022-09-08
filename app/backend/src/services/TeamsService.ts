import { StatusCodes } from 'http-status-codes';
import TeamsModels from '../database/models/TeamsModels';
import { ITeams } from '../interfaces';
import ErrorMiddleware from '../utils/error';

class TeamsService implements ITeams {
  constructor(private model: ITeams) {
    this.model = model;
  }

  async getAllTeams(): Promise<TeamsModels[]> {
    const teams = await this.model.getAllTeams();

    if (!teams) {
      throw new ErrorMiddleware(StatusCodes.NOT_FOUND, 'Teams not found');
    }
    return teams as unknown as TeamsModels[];
  }

  async getTeamById(id: number): Promise<TeamsModels | null> {
    const team = await this.model.getTeamById(id);

    if (!team) {
      throw new ErrorMiddleware(StatusCodes.NOT_FOUND, 'Team not found');
    }
    return team as unknown as TeamsModels;
  }
}

export default TeamsService;
