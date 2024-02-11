export interface PredictionData {
  rounds: Round[];
  users: Users;
}

export class User {
  id: string;
  displayName: string;
  predictions: Entrant[];
  season: RoundPerformance[];
  constructor(id: string, displayName: string, predictions: Entrant[]) {
    this.id = id;
    this.displayName = displayName;
    this.predictions = predictions;
    this.season = [];
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
  constructor(name: string, sName: string, id: number, color: string) {
    this.name = name;
    this.sName = sName;
    this.id = id;
    this.color = color;
  }
}
export interface Entrants {
  [key: string]: Entrant;
}

export class Round {
  trackName;
  standings;
  leaderboards: Leaderboards;
  entrantDiffTotals: EntrantDiffTotal[];
  constructor(trackName: string, driverStandings: Entrant[]) {
    this.trackName = trackName;
    this.standings = driverStandings;
    this.leaderboards = [];
    this.entrantDiffTotals = [];
  }
}

interface EntrantDiffTotal {
  entrant: Entrant;
  diffTotal: number;
}
type Leaderboards = Leaderboard[];

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
