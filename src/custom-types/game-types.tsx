export type Competition = "f1" | "eurovision" | "premierLeague";

export interface AllLocalSeasonData {
  [season: string]: LocalSeasonData;
}

export interface LocalSeasonData {
  allEntrants: AllEntrants;
  competition: Competition;
  isSeasonOver: boolean;
  predictionFreezeTime: Date;
  predictionsOpen: boolean;
  rounds: Round[];
  startingEntrantOrders?: StartingEntrantOrders;
}

/**Order that the entrants should first be ordered in when a user makes predictions */
export interface StartingEntrantOrders {
  [entrantType: string]: EntrantId[];
}
export interface AllEntrants {
  [entrantType: string]: Entrants;
}

export interface Entrants {
  [sName: string]: Entrant;
}

export type EntrantId = string;
export class Entrant {
  name: string;
  sName: string;
  color: string;
  /**For use on the stats page chart */
  secondaryColor: string;
  /**For use in the head to head as text colour on the primary colour chart */
  contrastColor: string;
  avgPrePos?: number;
  predictionedPositions: number[];
  pcPredictedToBeatTeammate?: number;
  constructor(
    name: string,
    sName: string,
    color: string,
    secondaryColor: string,
    contrastColor: string
  ) {
    this.name = name;
    this.sName = sName;
    this.color = color;
    this.secondaryColor = secondaryColor;
    this.contrastColor = contrastColor;
    this.predictionedPositions = [];
  }
}

export class User {
  id: string;
  displayName: string;
  information: string;
  lastSubmissionTime: Date;
  predictions: { [entrantType: string]: EntrantId[] };
  predictionsFromAvg: { [entrantType: string]: number };
  season: { [entrantType: string]: RoundPerformance[] };
  userType: "standard" | "special";
  controversyPercentile: { [entrantType: string]: number };
  constructor(
    displayName: string,
    id: string,
    lastSubmissionTime: Date,
    predictions: { [entrantType: string]: EntrantId[] },
    userType: "standard" | "special",
    predictionsFromAvg?: { [entrantType: string]: number }
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
  [userId: string]: User;
}

export class Round {
  entrantDiffTotals: { [entrantType: string]: EntrantDiffTotal[] };
  leaderboards: { [entrantType: string]: Leaderboard[] };
  standings: { [entrantType: string]: EntrantId[] };
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
  allEntrantStats: { [entrantType: string]: EntrantStats };
  roundStats: {
    entrantDiffTotals: { [entrantType: string]: EntrantDiffTotal[] };
  }[];
  users: Users;
}

export interface StatsData {
  controversialUserIds: ControversialUserIds;
  allEntrants: { [entrantType: string]: EntrantStats };
  noOfPredictions: { [entrantType: string]: number };
  rounds: {
    entrantDiffTotals: { [entrantType: string]: EntrantDiffTotal[] };
  }[];
}

export interface EntrantStats {
  [entrantType: string]: {
    avgPrePos?: number;
    predictionedPositions: number[];
    pcPredictedToBeatTeammate?: number;
  };
}

export interface ControversialUserIds {
  [entrantType: string]: {
    most: userId[];
    least: userId[];
  };
}
