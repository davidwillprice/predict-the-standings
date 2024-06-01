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

/**UserGameData (UGD) that is used both locally and on the DB */
class BaseUserGameData {
  _id: string;
  /**Display name of the above user */
  displayName: string;
  /**Date the UGB was submitted or last edited */
  lastSubmissionTime: Date;
  /**Arr of the prediction orders organised by entrantType - EntrantIds are converted to entrants using local data */
  predictions: { [entrantType: string]: EntrantId[] };
  /**_id of the user in the users collection who submitted the UGD document */
  userId: string;
  /**Submitted by a 'special' user whose prediction was manually inserted, or a standard user */
  userType: "standard" | "special";
  /**Number of predictions difference the user was from the average - Needs to be calculated */
  controversyPercentile: { [entrantType: string]: number };
  /**A note that appears in the <UserData> component - Only used for special users currently */
  information?: string;
  /**Number of predictions difference the user was from the average - Needs to be calculated */
  predictionsFromAvg: { [entrantType: string]: number };
  /**Arrs of rounds that the UGD was top of the leaderboard - Optional as not all UGD tops leaderboard*/
  roundsTop?: { [entrantType: string]: number[] };
  /**Number of times the user has edited their predictions - Optional as only used for standard users */
  timesPredictionsUpdated?: number;
  constructor(
    _id: string,
    displayName: string,
    lastSubmissionTime: Date,
    predictions: { [entrantType: string]: EntrantId[] },
    userId: string,
    userType: "standard" | "special"
  ) {
    this._id = _id;
    this.userId = userId;
    this.displayName = displayName;
    this.lastSubmissionTime = lastSubmissionTime;
    this.predictions = predictions;
    this.userType = userType;
    this.controversyPercentile = {};
    this.predictionsFromAvg = {};
  }
}

export class UserGameData extends BaseUserGameData {
  season: { [entrantType: string]: RoundPerformance[] };
  constructor(
    _id: string,
    displayName: string,
    lastSubmissionTime: Date,
    predictions: { [entrantType: string]: EntrantId[] },
    userId: string,
    userType: "standard" | "special"
  ) {
    super(_id, displayName, lastSubmissionTime, predictions, userId, userType);
    this.season = {};
  }
}

/**@todo Use for DB to avoid having .season and use a streamlined .leaderboards */
// export class UserGameData extends BaseUserGameData {
//   leaderboardPositions: { [entrantType: string]: number[] };
//   constructor(
//     displayName: string,
//     lastSubmissionTime: Date,
//     predictions: { [entrantType: string]: EntrantId[] },
//     userId: string,
//     userType: "standard" | "special"
//   ) {
//     super(displayName, lastSubmissionTime, predictions, userId, userType);
//     this.leaderboardPositions = {};
//   }
// }

export type UserId = string;

// export interface ProcessedUserGameDataMap {
//   [userId: string]: ProcessedUserGameData;
// }

export interface UserGameDataMap {
  [userId: string]: UserGameData;
}

export class Round {
  entrantDiffTotals: { [entrantType: string]: EntrantDiffTotal[] };
  leaderboards: { [entrantType: string]: Leaderboard[] };
  standings: { [entrantType: string]: EntrantId[] };
  accurateEntrants: {
    [entrantType: string]: { most: EntrantDiffTotal; least: EntrantDiffTotal };
  };
  venue;
  constructor(venue: string, standings: {}) {
    this.venue = venue;
    this.standings = standings;
    this.leaderboards = {};
    this.entrantDiffTotals = {};
    this.accurateEntrants = {};
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
  diffTotal?: number;
  /**How off each entrant prediction was in this round */
  diffs?: { entrantId: EntrantId; posDiff: number }[];
  /**No of perfect predictions, then predictions that were off by one, then predictions that were off by two etc) */
  diffCounts?: number[];
  leaderboardPos: number;
  percentCorrect?: number;
  prevLeaderboardPosDiff?: number;
}

export interface GameData {
  allEntrantStats: { [entrantType: string]: EntrantStats };
  controversialUserIds: ControversialUserIds;
  latestSubmissionUserId: UserId | null;
  leaderboardToppingUserIds: LeaderboardToppingUserIds | null;
  mostUpdatedPredictionUserIds: MostUpdatedPredictionUserIds;
  roundStats: {
    accurateEntrants: {
      [entrantType: string]: {
        most: EntrantDiffTotal;
        least: EntrantDiffTotal;
      };
    };
  }[];
  users: UserGameDataMap;
}

export interface StatsData {
  allEntrants: { [entrantType: string]: EntrantStats };
  controversialUserIds: ControversialUserIds;
  latestSubmissionUserId: UserId;
  leaderboardToppingUserIds: LeaderboardToppingUserIds;
  noOfPredictions: NoOfPredictions;
  mostUpdatedPredictionUserIds: MostUpdatedPredictionUserIds;
  rounds: {
    accurateEntrants: {
      [entrantType: string]: {
        most: EntrantDiffTotal;
        least: EntrantDiffTotal;
      };
    };
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

export interface LeaderboardToppingUserIds {
  [entrantType: string]: {
    userId: UserId;
    roundsTop: number[];
  }[];
}

export interface NoOfPredictions {
  [entrantType: string]: number;
}

/**Holds the name of a collection and the _id of the userGameData that will be accessed */
export type CollectionObj = {
  collectionName: string;
  _id: string;
};
