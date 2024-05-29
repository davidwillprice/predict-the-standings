import {
  AllEntrants,
  ControversialUserIds,
  Entrants,
  EntrantStats,
  GameData,
  LeaderboardToppingUserIds,
  MostUpdatedPredictionUserIds,
  Round,
  ShortHandCompStr,
  UserGameData,
  UserGameDataMap,
  UserId,
} from "@custom-types/game-types";
import { calcPercentile } from "./misc";

export const createGameData = async (
  allEntrants: AllEntrants,
  competition: ShortHandCompStr,
  rounds: Round[],
  users: UserGameDataMap
): Promise<GameData | string> => {
  //**Creates an 'average' user */
  users.average = new UserGameData(
    "Average",
    "average",
    new Date("3000-04-18T20:38:36.780Z"), //Stupidly high value so other players will always be positioned ahead if they have the same predictions
    {},
    "special"
  );
  users.average.userId = "average";
  users.average.information =
    "This prediction table is an automated average of all other player predictions.";

  users = generateAveragePredictions(allEntrants, users);

  users = orderAveragePredictions(allEntrants, users);

  users = calcUserGameDataMapPerformance(rounds, users);

  users = generateControversyData(users);

  rounds = calcLeaderboards(allEntrants, rounds, users);

  rounds = orderLeaderboards(rounds, users);

  users = addRoundsOnTopToUsers(rounds, users);

  /**Storing playerIds for use on the player stats page */
  const controversialUserIds = getControversialUserGameDataMap(users);
  const mostUpdatedPredictionUserIds =
    getUpdatedPredictionUserGameDataMap(users);
  const latestSubmissionUserId = getlatestSubmissionUserId(users);
  const leaderboardToppingUserIds = getLeaderboardToppingUserIds(users);

  users = addLeaderboardDataToUserGameDataMap(rounds, users);

  rounds = generateEntrantDiffTotals(rounds, users);

  allEntrants = getEntrantPredictedPositions(allEntrants, users);

  if (competition === "f1") {
    allEntrants = generateTeammateHeadToHead(allEntrants, users);
  }

  rounds = deleteLeaderboardDataFromRounds(rounds);

  const allEntrantStats = generateEntrantStats(allEntrants);

  users = streamlineUserGameDataForDb(users);

  return {
    allEntrantStats: allEntrantStats,
    controversialUserIds: controversialUserIds,
    latestSubmissionUserId: latestSubmissionUserId,
    leaderboardToppingUserIds: leaderboardToppingUserIds,
    mostUpdatedPredictionUserIds: mostUpdatedPredictionUserIds,
    roundStats: rounds.map((round) => {
      return {
        entrantDiffTotals: round.entrantDiffTotals,
      };
    }),
    users: users,
  };
};

/**Loop over each entrant finding their index in each user's prediction table, calculating an average and then adding it to each entrant as a new avgPrePos property */
const generateAveragePredictions = (
  allEntrants: AllEntrants,
  users: UserGameDataMap
) => {
  for (const entrantType of Object.keys(allEntrants)) {
    users.average.predictions[entrantType] = [];
    for (const entrant of Object.values(allEntrants[entrantType])) {
      let predictionPosTotal = 0;
      let noOfUserGameDataMap = 0;
      for (const user of Object.values(users)) {
        /**If the user is the generated average, ignore their predictions */
        if (user.id === "average") continue;
        predictionPosTotal +=
          user.predictions[entrantType].indexOf(entrant.sName) + 1;
        noOfUserGameDataMap++;
      }
      entrant.avgPrePos =
        Math.round((predictionPosTotal / noOfUserGameDataMap) * 10) / 10;
      users.average.predictions[entrantType].push(entrant.sName);
    }
  }
  return users;
};

//**Sort all 'average' user's predictions by how popular each entrant was */
const orderAveragePredictions = (
  allEntrants: AllEntrants,
  users: UserGameDataMap
): UserGameDataMap => {
  for (const entrantType in allEntrants) {
    users.average.predictions[entrantType].sort((entrantIdA, entrantIdB) =>
      allEntrants[entrantType][entrantIdA].avgPrePos! >
      allEntrants[entrantType][entrantIdB].avgPrePos!
        ? 1
        : -1
    );
  }
  return users;
};

//**Based on the user predictions and round data, calculate the differences in entrant predictions for each user, their diff totals and their count of each difference (perfect predictions, predictions that were one off etc) */
export const calcUserGameDataMapPerformance = (
  rounds: Round[],
  users: UserGameDataMap
) => {
  for (const entrantType of Object.keys(rounds[0].standings)) {
    /**Loop through each user to generate their entrant differences in this particular round*/
    for (let user of Object.values(users)) {
      /**If they already have a leaderboardPos, then this is being triggered JIT to get data for the leaderboard. If not, user.season is an empty object that needs to be totally populated */
      let hasLeaderboardPos: boolean;
      if (user.season[entrantType]) {
        hasLeaderboardPos = true;
      } else {
        hasLeaderboardPos = false;
        user.season[entrantType] = [];
      }
      rounds.forEach((round, roundIndex) => {
        /**If there is no previous season data, add a blank leaderboardPos to be calculated later */
        if (!hasLeaderboardPos) {
          user.season[entrantType].push({
            leaderboardPos: 0,
          });
        }
        const userRoundData = user.season[entrantType][roundIndex];
        /**Push blank round performance ready to fill out with data */
        userRoundData.diffCounts = [];
        userRoundData.percentCorrect = 0;
        userRoundData.prevLeaderboardPosDiff = 0;
        for (let i = 0; i < user.predictions[entrantType].length; i++) {
          userRoundData.diffCounts.push(0);
        }

        user = calcUserRoundPerformance(entrantType, user, round, roundIndex);
      });
    }
  }
  return users;
};

//**Loop over a user's predictions for a particular round, calc their pos difference from that round's standings */
export const calcUserRoundPerformance = (
  entrantType: string,
  user: UserGameData,
  round: Round,
  roundIndex: number
): UserGameData => {
  const userRoundData = user.season[entrantType][roundIndex];
  /**Ensure the diffs and diffTotals are blank */
  userRoundData.diffs = [];
  userRoundData.diffTotal = 0;
  for (const [predictedPos, entrantId] of Object.entries(
    user.predictions[entrantType]
  )) {
    /**Find the position the user predicted that entrant would come in the standings*/
    const actualPos = round.standings[entrantType].indexOf(entrantId);
    /**Work out how many positions the user is off*/
    const posDiff = actualPos - +predictedPos;
    if (!userRoundData.diffCounts) throw new Error("No diffCounts available");
    userRoundData.diffCounts[Math.abs(posDiff)]++;
    /**Add the posDiff to their total for this round*/
    userRoundData.diffTotal += Math.abs(posDiff);
    /**Add the entrant and their posDiff to the user's data*/
    userRoundData.diffs.push({
      entrantId: entrantId,
      posDiff,
    });
  }
  return user;
};

/**Populate the leaderboard for each user in each round*/
const calcLeaderboards = (
  allEntrants: AllEntrants,
  rounds: Round[],
  users: UserGameDataMap
): Round[] => {
  for (const entrantType in allEntrants) {
    rounds.forEach((round, roundIndex) => {
      /**Create blank leaderboard to avoid clashes with previous data */
      round.leaderboards[entrantType] = [];

      for (let user of Object.values(users)) {
        round.leaderboards[entrantType].push({
          userId: user.userId,
          percentCorrect: calcPredictionsAccuracy(
            user.predictions[entrantType].length,
            user.season[entrantType][roundIndex].diffTotal
          ),
        });
      }
    });
  }
  return rounds;
};

export const calcPredictionsAccuracy = (
  noOfEntrants: number,
  penaltyPoints: number | undefined
): number => {
  let maxDiff = 0;
  noOfEntrants--;
  while (noOfEntrants > 0) {
    maxDiff += noOfEntrants * 2;
    noOfEntrants -= 2;
  }
  if (!penaltyPoints)
    throw new Error(
      "Couldn't calculate predictions accuracy as the penalty points are undefined"
    );
  return Math.round(((maxDiff - penaltyPoints) / maxDiff) * 100);
};

/** Order leaderboards by percentage correct, then use perfect predictions as tie break, then use predictions that were 1 off as a tie break, then use predictions that were 2 off as a tie break etc */
const orderLeaderboards = (rounds: Round[], users: UserGameDataMap) => {
  rounds.forEach((round, roundIndex) => {
    for (const entrantType in round.leaderboards) {
      round.leaderboards[entrantType].sort(function (
        leaderboardA,
        leaderboardB
      ) {
        let order;

        const userA = users[leaderboardA.userId];
        const userB = users[leaderboardB.userId];

        /**Check if the two users have made the same predictions for this entrant type and if so, order them by who made the prediction first */
        if (
          userA.predictions[entrantType].toString() ===
          userB.predictions[entrantType].toString()
        ) {
          order = userA.lastSubmissionTime < userB.lastSubmissionTime ? -1 : 1;
        }

        if (leaderboardA.percentCorrect !== leaderboardB.percentCorrect) {
          /**Sort by percentage correct, highest first*/
          return leaderboardA.percentCorrect < leaderboardB.percentCorrect
            ? (order = 1)
            : (order = -1);
        } else {
          for (let i = 0; i < round.standings[entrantType].length; i++) {
            const userADiffCountArr =
              userA.season[entrantType][roundIndex].diffCounts;
            const userBDiffCountArr =
              userB.season[entrantType][roundIndex].diffCounts;
            /**Error handling */
            if (!userADiffCountArr || !userBDiffCountArr) {
              throw new Error("No diffCounts available");
            }
            /**If a has bigger diffCount than b return 1*/
            if (userADiffCountArr[i] < userBDiffCountArr[i]) {
              order = 1;
              break;
            } else if (
              /**If b has bigger diffCount than a return -1*/
              userADiffCountArr[i] > userBDiffCountArr[i]
            ) {
              order = -1;
              break;
            } else {
              /**If they have the same diffCount, continue the loop and compare a lower level of diffCount*/
              continue;
            }
          }
          if (!order) {
            order = 1;
          }
        }
        return order;
      });
    }
  });
  return rounds;
};

/**Add which rounds each user was first in the leaderboard to their userGameData */
const addRoundsOnTopToUsers = (
  rounds: Round[],
  users: UserGameDataMap
): UserGameDataMap => {
  rounds.forEach((round, roundIndex) => {
    for (const entrantType in round.leaderboards) {
      const userTopThisRound = users[round.leaderboards[entrantType][0].userId];
      if (userTopThisRound?.roundsTop === undefined)
        userTopThisRound.roundsTop = {};
      if (userTopThisRound.roundsTop[entrantType] === undefined)
        userTopThisRound.roundsTop[entrantType] = [];
      userTopThisRound.roundsTop[entrantType].push(roundIndex + 1);
    }
  });
  return users;
};

/**Copy leaderboard data from the round data to the user data, and calculate how each user's leaderboard position has changed since the previous round */
const addLeaderboardDataToUserGameDataMap = (
  rounds: Round[],
  users: UserGameDataMap
): UserGameDataMap => {
  rounds.forEach((round, roundIndex) => {
    for (const entrantType in round.leaderboards) {
      /**Loop over each user in order of the looped round's leaderboard*/
      for (const [curLeaderboardPos, curLeaderboardData] of Object.entries(
        round.leaderboards[entrantType]
      )) {
        const userData =
          users[curLeaderboardData.userId].season[entrantType][roundIndex];

        /**Attach the user's leaderboard position to their data for the looped round*/
        userData.leaderboardPos = +curLeaderboardPos + 1;

        /**Attach the user's accuracy to their data for the looped round*/
        userData.percentCorrect = curLeaderboardData.percentCorrect;

        /**Don't calculate the leaderboard changes of the first round */
        if (roundIndex === 0) continue;
        /**Find that user's position in the leaderboard of the round previous to the looped round*/
        const previousLbPos = rounds[roundIndex - 1].leaderboards[
          entrantType
        ].findIndex((entrant) => entrant.userId === curLeaderboardData.userId);
        /**Attach the user's leaderboard position change from the previous round to their data for the looped round*/
        userData.prevLeaderboardPosDiff = previousLbPos - +curLeaderboardPos;
      }
    }
  });
  return users;
};

/**Calculate how accurately each entrant has been predicted */
const generateEntrantDiffTotals = (
  rounds: Round[],
  users: UserGameDataMap
): Round[] => {
  /**Loop over rounds to generate the EntrantDiffTotals for each round*/
  rounds.forEach((round, roundIndex) => {
    for (const entrantType in round.leaderboards) {
      if (!round.entrantDiffTotals[entrantType])
        round.entrantDiffTotals[entrantType] = [];
      /**Loop over users to get their diffs for each entrant*/
      for (const user of Object.values(users)) {
        /**Loop over entrants to add each entrant's diffs to each total before moving onto the next user*/
        for (const entrantId of user.predictions[entrantType]) {
          /**If the entrantDiffTotals doesn't already contain an object for the entrant, push {entrant:[entrant], diffTotal:0}*/
          if (
            !round.entrantDiffTotals[entrantType].find(
              (x) => x.entrantId === entrantId
            )
          ) {
            round.entrantDiffTotals[entrantType].push({
              entrantId: entrantId,
              diffTotal: 0,
            });
          }

          const userDiffsArr = user.season[entrantType][roundIndex].diffs;
          if (!userDiffsArr)
            throw new Error(
              `Couldn't generate entrant diff totals as ${user.displayName} has no diff array for ${entrantType} round ${roundIndex}`
            );
          /**Find entrant in user's predictions for the round*/
          const entrantStanding = userDiffsArr.find(
            (element) => element.entrantId === entrantId
          )!;
          /**Find entrantDiff total*/
          let entrantTotal = rounds[roundIndex].entrantDiffTotals[
            entrantType
          ].find((element) => element.entrantId === entrantId)!;
          /**Add entrantStanding.posDiff to entrant's diff total*/
          entrantTotal.diffTotal += Math.abs(entrantStanding.posDiff);
        }
      }
      /**Sort least and most accurate entrants by their diff totals */
      round.entrantDiffTotals[entrantType].sort((a, b) =>
        a.diffTotal > b.diffTotal ? 1 : -1
      );
    }
  });

  return rounds;
};

/**For use on the stats page, generate an array for each entrant with the percentage of people who predicted them in each position */
const getEntrantPredictedPositions = (
  allEntrants: AllEntrants,
  users: UserGameDataMap
): AllEntrants => {
  const noOfUserGameDataMap = Object.keys(users).length - 1;

  for (const [entrantType, entrants] of Object.entries(allEntrants)) {
    const noOfEntrants = Object.keys(entrants).length;
    for (const entrant of Object.values(entrants)) {
      /**Create set up base position array */
      entrant.predictionedPositions = [];
      for (let i = 0; i < noOfEntrants; i++) {
        entrant.predictionedPositions.push(0);
      }
      /**Loop over users, obtain the position index they predicted the entrant in, then plus one to that index in the entrant position array  */
      for (const user of Object.values(users)) {
        /**If the user is the generated average, ignore their predictions */
        if (user.id === "average") continue;

        const userPredictedPos = user.predictions[entrantType].indexOf(
          entrant.sName
        );
        entrant.predictionedPositions[userPredictedPos]++;
      }

      /**Turn predictedPositions into percentage */
      entrant.predictionedPositions = entrant.predictionedPositions.map((pos) =>
        Math.round((pos / noOfUserGameDataMap) * 100)
      );
    }
  }
  return allEntrants;
};

/**For every user, find their highest predicted driver for each team, total for all users, then convert that to a percentage and attach it to the driver */
const generateTeammateHeadToHead = (
  allEntrants: AllEntrants,
  users: UserGameDataMap
) => {
  const drivers = allEntrants.drivers;
  const teams = allEntrants.teams;
  /**Clear any old values from previous renders*/
  for (const driver of Object.values(drivers)) {
    driver.pcPredictedToBeatTeammate = 0;
  }
  const noOfUserGameDataMap = Object.keys(users).length - 1;
  for (const team of Object.values(teams)) {
    /**Array of driverIds */
    let teammatesArr: string[] = [];
    for (const driver of Object.values(drivers)) {
      if (driver.color === team.color) teammatesArr.push(driver.sName);
    }

    for (const user of Object.values(users)) {
      /**If the user is the generated average, ignore their predictions */
      if (user.id === "average") continue;

      const higherPredictedDriverId = user.predictions["drivers"].filter(
        (driverId) =>
          driverId === teammatesArr[0] || driverId === teammatesArr[1]
      )[0];
      const higherPredictedDriver = drivers[higherPredictedDriverId];

      if (typeof higherPredictedDriver.pcPredictedToBeatTeammate !== "number") {
        higherPredictedDriver.pcPredictedToBeatTeammate = 1;
      } else {
        higherPredictedDriver.pcPredictedToBeatTeammate++;
      }
    }
  }
  for (const driver of Object.values(drivers)) {
    driver.pcPredictedToBeatTeammate = driver.pcPredictedToBeatTeammate
      ? Math.round(
          (driver.pcPredictedToBeatTeammate / noOfUserGameDataMap) * 100
        )
      : 0;
  }

  return { drivers: drivers, teams: teams };
};

/**Calculate how far away each user's predictions are from the average predictions */
export function generateControversyData(
  users: UserGameDataMap
): UserGameDataMap {
  for (const user of Object.values(users)) {
    /**If the user is the generated average, ignore their predictions */
    if (user.id === "average") continue;

    for (const entrantType of Object.keys(user.predictions)) {
      user.predictionsFromAvg[entrantType] = 0;

      for (const [predictedPos, entrant] of Object.entries(
        user.predictions[entrantType]
      )) {
        const avgPredictedPos =
          users.average.predictions[entrantType].indexOf(entrant);

        const posDiffs = Math.abs(+predictedPos - avgPredictedPos);
        user.predictionsFromAvg[entrantType] += posDiffs;
      }
    }
  }

  /**Now main contro data is created, calculate controversy percentiles*/
  for (const entrantType of Object.keys(users.average.predictions)) {
    /**Create an array of every predictionsFromAvg for every user (besides the average) */
    const predictionsFromAvgArr = Object.values(users)
      .filter((user) => user.id !== "average")
      .map((user) => user.predictionsFromAvg[entrantType]);

    /**Use arr to calculate the controversy percentile for a user */
    for (const user of Object.values(users)) {
      if (user.id === "average") continue;
      user.controversyPercentile[entrantType] =
        Math.trunc(
          calcPercentile(
            predictionsFromAvgArr,
            user.predictionsFromAvg[entrantType]
          ) * 10
        ) / 10;
    }
  }
  return users;
}

/**Get only the userIds of those who were the most/least controversial */
function getControversialUserGameDataMap(
  users: UserGameDataMap
): ControversialUserIds {
  let controversialUserGameDataMap: ControversialUserIds = {};
  let mostLeastControUserArrs: { [key: string]: UserGameData[] } = {};

  /**Populate controversyArrays with the all users in any order */
  for (const user of Object.values(users)) {
    if (user.displayName === "Average") continue;
    for (const entrantType in user.predictions) {
      if (!mostLeastControUserArrs[entrantType])
        mostLeastControUserArrs[entrantType] = [];
      mostLeastControUserArrs[entrantType].push(user);
    }
  }

  /**Order users in mostLeastControUserArrs by how controversial they are */
  for (const entrantType in mostLeastControUserArrs) {
    mostLeastControUserArrs[entrantType].sort((a, b) =>
      a.predictionsFromAvg[entrantType]! > b.predictionsFromAvg[entrantType]!
        ? 1
        : -1
    );
  }

  /**Get the userIds of the those who were the most/least controversial*/
  for (const entrantType in mostLeastControUserArrs) {
    /**Get most/least controversial users*/
    const mostControUser =
      mostLeastControUserArrs[entrantType][
        mostLeastControUserArrs[entrantType].length - 1
      ];
    const leastControUser = mostLeastControUserArrs[entrantType][0];

    /**Filter the userArr by those who are as contro as the most/least contro user, then add their Ids to the controversialUserGameDataMap obj*/
    controversialUserGameDataMap[entrantType] = {
      most: mostLeastControUserArrs[entrantType]
        .filter(
          (user) =>
            user.predictionsFromAvg[entrantType] ===
            mostControUser.predictionsFromAvg[entrantType]
        )
        .map((user) => user.userId),
      least: mostLeastControUserArrs[entrantType]
        .filter(
          (user) =>
            user.predictionsFromAvg[entrantType] ===
            leastControUser.predictionsFromAvg[entrantType]
        )
        .map((user) => user.userId),
    };
  }
  return controversialUserGameDataMap;
}

/**Get only the userIds of those who updated their predictions the most */
function getUpdatedPredictionUserGameDataMap(
  users: UserGameDataMap
): MostUpdatedPredictionUserIds {
  let mostUpdatedPredictionUserArr: UserGameData[] = [];

  /**Populate arrays with the all users with a 'timesPredictionsUpdated' value in any order */
  for (const user of Object.values(users)) {
    if (!user.timesPredictionsUpdated) continue;
    mostUpdatedPredictionUserArr.push(user);
  }

  if (mostUpdatedPredictionUserArr.length === 0) return [];

  /**Order users by how many times they updated their predictions */
  mostUpdatedPredictionUserArr.sort((a, b) =>
    a.timesPredictionsUpdated! > b.timesPredictionsUpdated! ? -1 : 1
  );

  const mostTimesAUserUpdatedPredictions =
    mostUpdatedPredictionUserArr[0].timesPredictionsUpdated;

  mostUpdatedPredictionUserArr = mostUpdatedPredictionUserArr.filter(
    (user) => user.timesPredictionsUpdated === mostTimesAUserUpdatedPredictions
  );

  return mostUpdatedPredictionUserArr.map((user) => user.userId);
}

/**Get the userId of the user who submitted their last predictions the latest */
const getlatestSubmissionUserId = (users: UserGameDataMap): UserId => {
  /**Add standard users to an array */
  const userGameDataArr: UserGameData[] = [];
  Object.values(users).map((user) => {
    if (user.userType === "standard") {
      userGameDataArr.push(user);
    }
  });

  /**Order standard users by how late they last updated their predictions */
  userGameDataArr.sort((a, b) =>
    a.lastSubmissionTime.getTime() > b.lastSubmissionTime.getTime() ? -1 : 1
  );

  return userGameDataArr[0].userId;
};

/**The leaderboards are unbounded arrays so I don't want to upload them to the DB */
const deleteLeaderboardDataFromRounds = (rounds: Round[]) => {
  rounds.forEach((round) => {
    round.leaderboards = {};
  });
  return rounds;
};

/**Strip down an Entrants Obj to only the data needed for the stats page */
const generateEntrantStats = (
  allEntrants: AllEntrants
): { [entrantType: string]: EntrantStats } => {
  const allEntrantStats: { [entrantType: string]: EntrantStats } = {};

  for (const [entrantType, entrants] of Object.entries(allEntrants)) {
    const entrantStats: EntrantStats = {};
    Object.values(entrants).forEach((entrant) => {
      entrantStats[entrant.sName] = {
        avgPrePos: entrant.avgPrePos,
        predictionedPositions: entrant.predictionedPositions,
        pcPredictedToBeatTeammate: entrant.pcPredictedToBeatTeammate,
      };
    });
    allEntrantStats[entrantType] = entrantStats;
  }

  return allEntrantStats;
};

const getLeaderboardToppingUserIds = (
  users: UserGameDataMap
): LeaderboardToppingUserIds => {
  /**Add create arrays for each entrantType which hold objects with a userId and the rounds they were top */
  let leaderboardToppingUserIds: LeaderboardToppingUserIds = {};
  for (const entrantType of Object.keys(users.average.predictions)) {
    leaderboardToppingUserIds[entrantType] = [];
    for (const userGameData of Object.values(users)) {
      if (userGameData.roundsTop && userGameData.roundsTop[entrantType]) {
        leaderboardToppingUserIds[entrantType].push({
          userId: userGameData.userId,
          roundsTop: userGameData.roundsTop[entrantType],
        });
      }
    }
    /**Sort the arrays by those who were top for the most rounds */
    leaderboardToppingUserIds[entrantType].sort((a, b) =>
      a.roundsTop.length > b.roundsTop.length ? -1 : 1
    );
  }
  return leaderboardToppingUserIds;
};

const streamlineUserGameDataForDb = (
  users: UserGameDataMap
): UserGameDataMap => {
  for (const user of Object.values(users)) {
    for (const roundArr of Object.values(user.season)) {
      for (const roundPerformance of Object.values(roundArr)) {
        delete roundPerformance.diffs;
        delete roundPerformance.diffTotal;
        delete roundPerformance.diffCounts;
        delete roundPerformance.percentCorrect;
        delete roundPerformance.prevLeaderboardPosDiff;
      }
    }
  }
  return users;
};

/**Generate the accuracy and the prevLeaderboardPosDiff for every user/entrantType/round
 * Only used JIT for the leaderboard
 */
export const calculateRemainingRoundPerformanceData = (
  noOfPredictions: number,
  users: UserGameDataMap
): UserGameDataMap => {
  for (let user of Object.values(users)) {
    for (const [entrantType, roundPerformanceArr] of Object.entries(
      user.season
    )) {
      roundPerformanceArr.forEach((_, roundIndex) => {
        const userRoundData = user.season[entrantType][roundIndex];
        userRoundData.prevLeaderboardPosDiff =
          roundIndex === 0
            ? 0
            : user.season[entrantType][roundIndex - 1].leaderboardPos -
              user.season[entrantType][roundIndex].leaderboardPos;
        userRoundData.percentCorrect = calcPredictionsAccuracy(
          noOfPredictions,
          userRoundData.diffTotal
        );
      });
    }
  }
  return users;
};
