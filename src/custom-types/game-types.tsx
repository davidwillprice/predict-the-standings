export type AllLocalSeasonData = LocalSeasonData[];

export class LocalSeasonData {
  allEntrants: AllEntrants;
  competitionStrs: CompetitionStrings = {
    display: "",
    hyphenated: "",
    shortHand: "",
  };
  /**Season string like '2023' or '2023-2024' */
  id: string;
  /**True when the final round of data has come in */
  isSeasonOver: boolean;
  /**Automatically calculated via the freeze date */
  arePredictionsFrozen: boolean;
  /**Date/time that prediction submissions get rejected by the DB */
  predictionFreezeDate: Date;
  /**True when predictions start being allowed and then starts true after that */
  predictionsOpen: boolean;
  rounds: Round[];
  startingEntrantOrders?: StartingEntrantOrders;
  status:
    | "preseason"
    | "predictions open"
    | "predictions closed"
    | "midseason"
    | "completed";
  /**Once a season is over no more game data updates need to be made to the collection, lock the gamedata */
  isGameDataLocked: boolean;
  constructor(
    allEntrants: AllEntrants,
    id: string,
    isGameDataLocked: boolean,
    isSeasonOver: boolean,
    predictionFreezeDate: Date,
    predictionsOpen: boolean,
    rounds: Round[],
    startingEntrantOrders?: StartingEntrantOrders
  ) {
    this.allEntrants = allEntrants;
    this.id = id;
    this.isSeasonOver = isSeasonOver;
    this.arePredictionsFrozen =
      predictionFreezeDate.getTime() < new Date().getTime();
    this.predictionFreezeDate = predictionFreezeDate;
    this.predictionsOpen = predictionsOpen;
    this.rounds = rounds;
    this.startingEntrantOrders = startingEntrantOrders;
    this.status = !predictionsOpen
      ? "preseason"
      : predictionFreezeDate.getTime() > new Date().getTime()
      ? "predictions open"
      : rounds.length < 1
      ? "predictions closed"
      : !isSeasonOver
      ? "midseason"
      : "completed";
    this.isGameDataLocked = isGameDataLocked;
  }
}

export type CompetitionStrings = {
  display: DisplayCompStr;
  hyphenated: HyphenatedCompStr;
  shortHand: ShortHandCompStr;
};
export type DisplayCompStr = string;
export type HyphenatedCompStr = string;
export type ShortHandCompStr = string;

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

export class UserGameData {
  id: string;
  displayName: string;
  information: string;
  lastSubmissionTime: Date;
  predictions: { [entrantType: string]: EntrantId[] };
  predictionsFromAvg: { [entrantType: string]: number };
  season: { [entrantType: string]: RoundPerformance[] };
  userType: "standard" | "special";
  controversyPercentile: { [entrantType: string]: number };
  timesPredictionsUpdated?: number;
  roundsTop?: { [entrantType: string]: number[] };
  userId: string;
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
    this.userId = "";
    this.userType = userType;
  }
}

export type UserId = string;

export interface UserGameDataMap {
  [userId: string]: UserGameData;
}

export class Round {
  entrantDiffTotals: { [entrantType: string]: EntrantDiffTotal[] };
  leaderboards: { [entrantType: string]: Leaderboard[] };
  standings: { [entrantType: string]: EntrantId[] };
  venue;
  constructor(venue: string, standings: {}) {
    this.venue = venue;
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
  userId: UserId;
  percentCorrect: number;
};

export interface RoundPerformance {
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
  allEntrantStats: { [entrantType: string]: EntrantStats };
  controversialUserIds: ControversialUserIds;
  latestSubmissionUserId: UserId;
  mostUpdatedPredictionUserIds: MostUpdatedPredictionUserIds;
  roundStats: {
    entrantDiffTotals: { [entrantType: string]: EntrantDiffTotal[] };
  }[];
  users: UserGameDataMap;
}

export interface StatsData {
  controversialUserIds: ControversialUserIds;
  allEntrants: { [entrantType: string]: EntrantStats };
  latestSubmissionUserId: UserId;
  noOfPredictions: { [entrantType: string]: number };
  mostUpdatedPredictionUserIds: MostUpdatedPredictionUserIds;
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
    most: UserId[];
    least: UserId[];
  };
}
export type MostUpdatedPredictionUserIds = UserId[];
