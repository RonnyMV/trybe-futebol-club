import TeamsModels from '../database/models/TeamsModels';
import { ITeams } from '../interfaces';

class TeamsRepository implements ITeams {
  constructor(private model = TeamsModels) {
  }

  async getAllTeams(): Promise<TeamsModels[]> {
    const teams = await this.model.findAll();

    return teams as unknown as TeamsModels[];
  }

  async getTeamById(id: number): Promise<TeamsModels | null> {
    const team = await this.model.findByPk(id);

    return team as unknown as TeamsModels;
  }
}

export default TeamsRepository;
