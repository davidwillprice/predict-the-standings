export interface PredictionData {
  entrants: { [key: string]: Entrants };
  rounds: Round[];
  lastUpdated: Date;
  users: Users;
}

export class User {
  id: string;
  displayName: string;
  information: string;
  predictions: { [key: string]: Entrant[] };
  season: { [key: string]: RoundPerformance[] };
  constructor(
    id: string,
    displayName: string,
    predictions: { [key: string]: Entrant[] }
  ) {
    this.id = id;
    this.displayName = displayName;
    this.predictions = predictions;
    this.season = {};
    this.information = "";
  }
}
export interface Users {
  [key: string]: User;
}

export class Entrant {
  name: string;
  sName: string;
  id: number;
  color: string;
  avgPrePos?: number;
  predictionedPositions: number[];
  pcPredictedToBeatTeammate?: number;
  constructor(name: string, sName: string, id: number, color: string) {
    this.name = name;
    this.sName = sName;
    this.id = id;
    this.color = color;
    this.predictionedPositions = [];
  }
}
export interface Entrants {
  [key: string]: Entrant;
}

export class Round {
  entrantDiffTotals: { [key: string]: EntrantDiffTotal[] };
  leaderboards: { [key: string]: Leaderboard[] };
  standings: { [key: string]: Entrant[] };
  trackName;
  constructor(trackName: string, standings: {}) {
    this.trackName = trackName;
    this.standings = standings;
    this.leaderboards = {};
    this.entrantDiffTotals = {};
  }
}

interface EntrantDiffTotal {
  entrant: Entrant;
  diffTotal: number;
}

export type Leaderboard = {
  user: User;
  percentCorrect: Number;
  prevRdDiff: number;
};

interface RoundPerformance {
  diffTotal: number;
  diffs: { entrant: Entrant; posDiff: number }[];
  /**No of perfect predictions, then predictions that were off by one, then predictions that were off by two etc) */
  diffCounts: number[];
}
