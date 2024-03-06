export class User {
  id: number;
  displayName?: string;
  information: string;
  predictions: { [key: string]: EntrantId[] };
  season: { [key: string]: RoundPerformance[] };
  predictionsFromAvg: { [key: string]: number };
  constructor(id: number, predictions: { [key: string]: EntrantId[] }) {
    this.id = id;
    this.displayName = "";
    this.predictions = predictions;
    this.season = {};
    this.information = "";
    this.predictionsFromAvg = {};
  }
}
export interface Users {
  [key: string]: User;
}

export interface JsonPrediction {
  user_id: number;
  driver_predictions: string[];
  team_predictions: string[];
}

export interface UserIdData {
  id: number;
  display_name: string;
}

export class Entrant {
  name: string;
  sName: string;
  id: number;
  color: string;
  contrastColor: string;
  avgPrePos?: number;
  predictionedPositions: number[];
  pcPredictedToBeatTeammate?: number;
  constructor(
    name: string,
    sName: string,
    id: number,
    color: string,
    contrastColor: string
  ) {
    this.name = name;
    this.sName = sName;
    this.id = id;
    this.color = color;
    this.contrastColor = contrastColor;
    this.predictionedPositions = [];
  }
}
export type EntrantId = string;
export interface Entrants {
  [key: string]: Entrant;
}

export class Round {
  entrantDiffTotals: { [key: string]: EntrantDiffTotal[] };
  leaderboards: { [key: string]: Leaderboard[] };
  standings: { [key: string]: EntrantId[] };
  trackName;
  constructor(trackName: string, standings: {}) {
    this.trackName = trackName;
    this.standings = standings;
    this.leaderboards = {};
    this.entrantDiffTotals = {};
  }
}

interface EntrantDiffTotal {
  entrant: EntrantId;
  diffTotal: number;
}

export type Leaderboard = {
  userId: number;
  percentCorrect: number;
  prevRdDiff: number;
};

interface RoundPerformance {
  diffTotal: number;
  diffs: { entrant: EntrantId; posDiff: number }[];
  /**No of perfect predictions, then predictions that were off by one, then predictions that were off by two etc) */
  diffCounts: number[];
}

export interface PredictionData {
  entrants: { [key: string]: Entrants };
  rounds: Round[];
  lastUpdated: Date;
  users: Users;
}
