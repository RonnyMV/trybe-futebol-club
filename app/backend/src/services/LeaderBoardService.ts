import { Op } from 'sequelize';
import { ILeaderBoard, ILeaderBoards, IMatch, IMatches, ITeam } from '../interfaces';
import TeamsModels from '../repositoryModel/TeamsRepository';

class LeaderBoardService implements ILeaderBoards {
  private teamModel: TeamsModels;

  constructor(private model: IMatches) {
    this.model = model;
    this.teamModel = new TeamsModels();
  }

  static createTotalVictories(matches: IMatch[], matchAttr: number | string): number {
    return matches.reduce((acc: number, match: IMatch) => {
      const verifyMatchHome = matchAttr === 'homeTeam' || match.homeTeam === matchAttr;
      const verifyMatchAway = matchAttr === 'awayTeam' || match.awayTeam === matchAttr;
      if (verifyMatchHome && match.homeTeamGoals > match.awayTeamGoals) return acc + 1;
      if (verifyMatchAway && match.awayTeamGoals > match.homeTeamGoals) return acc + 1;
      return acc;
    }, 0);
  }

  static createTotalDraws(matches: IMatch[], matchAttr: number | string): number {
    return matches.reduce((acc: number, match: IMatch) => {
      const verifyMatchHome = matchAttr === 'homeTeam' || match.homeTeam === matchAttr;
      const verifyMatchAway = matchAttr === 'awayTeam' || match.awayTeam === matchAttr;
      if (verifyMatchHome && match.homeTeamGoals === match.awayTeamGoals) return acc + 1;
      if (verifyMatchAway && match.awayTeamGoals === match.homeTeamGoals) return acc + 1;
      return acc;
    }, 0);
  }

  static createTotalLosses(matches: IMatch[], matchAttr: number | string): number {
    return matches.reduce((acc: number, match: IMatch) => {
      const verifyMatchHome = matchAttr === 'homeTeam' || match.homeTeam === matchAttr;
      const verifyMatchAway = matchAttr === 'awayTeam' || match.awayTeam === matchAttr;
      if (verifyMatchHome && match.homeTeamGoals < match.awayTeamGoals) return acc + 1;
      if (verifyMatchAway && match.awayTeamGoals < match.homeTeamGoals) return acc + 1;
      return acc;
    }, 0);
  }

  static createGoalsFavor(matches: IMatch[], matchAttr: number | string): number {
    return matches.reduce((acc: number, match: IMatch) => {
      const verifyMatchHome = matchAttr === 'homeTeam' || match.homeTeam === matchAttr;
      const verifyMatchAway = matchAttr === 'awayTeam' || match.awayTeam === matchAttr;
      if (verifyMatchHome) return acc + match.homeTeamGoals;
      if (verifyMatchAway) return acc + match.awayTeamGoals;
      return acc;
    }, 0);
  }

  static createGoalsOwn(matches: IMatch[], matchAttr: number | string): number {
    return matches.reduce((acc: number, match: IMatch) => {
      const verifyMatchHome = matchAttr === 'homeTeam' || match.homeTeam === matchAttr;
      const verifyMatchAway = matchAttr === 'awayTeam' || match.awayTeam === matchAttr;
      if (verifyMatchHome) return acc + match.awayTeamGoals;
      if (verifyMatchAway) return acc + match.homeTeamGoals;
      return acc;
    }, 0);
  }

  static createOrdenatedLeaderBoard(board: ILeaderBoard[]): ILeaderBoard[] {
    return board.sort((teamA: ILeaderBoard, teamB: ILeaderBoard) => {
      if (teamA.totalPoints === teamB.totalPoints) {
        return teamB.totalVictories - teamA.totalVictories
        || teamB.goalsBalance - teamA.goalsBalance
        || teamB.goalsFavor - teamA.goalsFavor
        || teamB.goalsOwn - teamA.goalsOwn;
      }
      return teamB.totalPoints - teamA.totalPoints;
    });
  }

  static createBoard(matchesId: IMatch[], matchAtt: string | number):Partial<ILeaderBoard> {
    const totalGames = matchesId.length;
    const totalVictories = this.createTotalVictories(matchesId, matchAtt);
    const totalDraws = this.createTotalDraws(matchesId, matchAtt);
    const totalLosses = this.createTotalLosses(matchesId, matchAtt);
    const goalsFavor = this.createGoalsFavor(matchesId, matchAtt);
    const goalsOwn = this.createGoalsOwn(matchesId, matchAtt);
    const totalPoints = (totalVictories * 3) + totalDraws;
    const goalsBalance = goalsFavor - goalsOwn;
    const efficiency = Number((totalPoints / (totalGames * 3)) * 100).toFixed(2);

    return { totalPoints,
      totalGames,
      totalVictories,
      totalDraws,
      totalLosses,
      goalsFavor,
      goalsOwn,
      goalsBalance,
      efficiency };
  }

  async createLeaderBoard(matchAttribute: string): Promise<ILeaderBoard | null> {
    const teams = await this.teamModel.getAllTeams();

    const leaderBoard = await Promise.all(teams?.map(async (team: ITeam) => {
      const matchesById = await this.model.getMatchesByTeam(Number(team.id), matchAttribute);
      const createBoard = LeaderBoardService.createBoard(matchesById, matchAttribute);
      return {
        name: team.teamName,
        ...createBoard,
      };
    }));

    LeaderBoardService.createOrdenatedLeaderBoard(leaderBoard as unknown as ILeaderBoard[]);

    return leaderBoard as unknown as ILeaderBoard;
  }

  async createLeaderBoardGeneral(): Promise<ILeaderBoard | null> {
    const teams = await this.teamModel.getAllTeams();

    const leaderBoard = await Promise.all(teams?.map(async (team: ITeam) => {
      const matchesById = await this.model.getAllMatches({ where: {
        [Op.or]: [{ homeTeam: Number(team.id) }, { awayTeam: Number(team.id) }],
        inProgress: false,
      },
      });
      const createBoard = LeaderBoardService.createBoard(matchesById, Number(team.id));
      return {
        name: team.teamName,
        ...createBoard,
      };
    }));

    LeaderBoardService.createOrdenatedLeaderBoard(leaderBoard as unknown as ILeaderBoard[]);

    return leaderBoard as unknown as ILeaderBoard;
  }
}

export default LeaderBoardService;
