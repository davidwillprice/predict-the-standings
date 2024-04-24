export class User {
  id: string;
  displayName: string;
  information: string;
  lastSubmissionTime: Date;
  predictions: { [key: string]: EntrantId[] };
  predictionsFromAvg: { [key: string]: number };
  season: { [key: string]: RoundPerformance[] };
  userType: "standard" | "special";
  controversyPercentile: { [key: string]: number };
  constructor(
    displayName: string,
    id: string,
    lastSubmissionTime: Date,
    predictions: { [key: string]: EntrantId[] },
    userType: "standard" | "special",
    predictionsFromAvg?: { [key: string]: number }
  ) {
    this.id = id;
    this.controversyPercentile = {};
    this.displayName = displayName;
    this.information = "";
    this.lastSubmissionTime = lastSubmissionTime;
    this.predictions = predictions;
    this.predictionsFromAvg = predictionsFromAvg || {};
    this.season = {};
    this.userType = userType;
  }
}

type userId = string;

export interface Users {
  [key: string]: User;
}

export interface JsonPrediction {
  user_id: number;
  driver_predictions: string[];
  team_predictions: string[];
}

/**@todo Delete */
export interface UserIdData {
  id: number;
  displayName: string;
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
  entrantId: EntrantId;
  diffTotal: number;
}

export type Leaderboard = {
  userId: userId;
  percentCorrect: number;
};

interface RoundPerformance {
  /**Total of how off all entrant predictions were in this round */
  diffTotal: number;
  /**How off each entrant prediction was in this round */
  diffs: { entrantId: EntrantId; posDiff: number }[];
  /**No of perfect predictions, then predictions that were off by one, then predictions that were off by two etc) */
  diffCounts: number[];
  leaderboardPos: number;
  percentCorrect: number;
  prevLeaderboardPosDiff: number;
}

export interface GameData {
  controversialUserIds: ControversialUserIds;
  entrantStats: { [key: string]: EntrantStats };
  roundStats: { entrantDiffTotals: { [key: string]: EntrantDiffTotal[] } }[];
  users: Users;
}

export interface StatsData {
  controversialUserIds: ControversialUserIds;
  entrantStats: { [key: string]: EntrantStats };
  noOfPredictions: { [key: string]: number };
  roundStats: { entrantDiffTotals: { [key: string]: EntrantDiffTotal[] } }[];
}

export interface EntrantStats {
  [key: string]: {
    avgPrePos?: number;
    predictionedPositions: number[];
    pcPredictedToBeatTeammate?: number;
  };
}

export interface ControversialUserIds {
  [key: string]: {
    most: userId[];
    least: userId[];
  };
}
