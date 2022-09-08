const team = 'Avaí/Kindermann';

const ALL_TEAM_MOCK = [{
  id: 1,
  teamName: team,
}] as any;

const BOARD_HOME_MOCK = [
  {
    name: team,
    totalPoints: 1,
    totalGames: 3,
    totalVictories: 0,
    totalDraws: 1,
    totalLosses: 2,
    goalsFavor: 3,
    goalsOwn: 7,
    goalsBalance: -4,
    efficiency: '11.11',
  }] as any;

const ALL_MATCHES_HOME_MOCK = [{
  id: 9,
  homeTeam: 1,
  homeTeamGoals: 0,
  awayTeam: 12,
  awayTeamGoals: 3,
  inProgress: false,
  teamHome: {
    teamName: team,
  },
  teamAway: {
    teamName: 'Palmeiras',
  },
}, {
  id: 17,
  homeTeam: 1,
  homeTeamGoals: 2,
  awayTeam: 8,
  awayTeamGoals: 3,
  inProgress: false,
  teamHome: {
    teamName: team,
  },
  teamAway: {
    teamName: 'Grêmio',
  },
}, {
  id: 33,
  homeTeam: 1,
  homeTeamGoals: 1,
  awayTeam: 16,
  awayTeamGoals: 1,
  inProgress: false,
  teamHome: {
    teamName: team,
  },
  teamAway: {
    teamName: 'São Paulo',
  },
}] as any;

export default BOARD_HOME_MOCK;

export { ALL_TEAM_MOCK, ALL_MATCHES_HOME_MOCK };
