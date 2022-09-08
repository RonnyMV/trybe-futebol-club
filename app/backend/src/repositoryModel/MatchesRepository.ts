import MatchesModel from '../database/models/MatchesModels';
import TeamsModels from '../database/models/TeamsModels';
import { IMatch, IMatches } from '../interfaces';

class MatchesRepository implements IMatches {
  constructor(private model = MatchesModel) {
  }

  async getAllMatches(payload: object | null): Promise<IMatch[]> {
    const matches = await this.model.findAll({
      ...payload,
      include: [
        { model: TeamsModels, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: TeamsModels, as: 'teamAway', attributes: { exclude: ['id'] } },
      ],
    });

    return matches as unknown as IMatch[];
  }

  async createNewMatch(match: IMatch): Promise<MatchesModel | null> {
    const newMatch = await this.model.create(match);

    return newMatch as unknown as MatchesModel;
  }

  async getMatchById(id: number): Promise<MatchesModel | null> {
    const matchById = await this.model.findByPk(id);
    return matchById as MatchesModel;
  }

  async getMatchesByTeam(id: number, matchAttribute: string): Promise<IMatch[]> {
    const matchesById = await this.model.findAll(
      { where: { [matchAttribute]: id, inProgress: false } },
    );
    return matchesById as unknown as IMatch[];
  }

  async updateMatch(id: number, body: IMatch): Promise<void | null> {
    await this.model.update(body, { where: { id } });
    return { message: 'Finished' } as unknown as void;
  }
}

export default MatchesRepository;
