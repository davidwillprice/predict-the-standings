import { getAllF1PredictionTablesQuery } from "./db-functions";
/**@todo Bring all data into a single file so different seasons and sports can be obtained automatically */

import { Sport } from "@custom-types/misc";
import {
  PredictionData,
  Entrants,
  Round,
  User,
  Users,
} from "@custom-types/game-types";

export const getAllPredictonData = async (
  drivers: Entrants,
  teams: Entrants,
  rounds: Round[],
  season: string,
  sport: Sport
): Promise<PredictionData | string> => {
  let res = await getUserData(drivers, season, sport, teams);
  //**If getUsersData didn't generate valid Users, return error message */
  if (typeof res === "string") return res;
  let users = res;

  //**Creates an 'average' user */
  users.Average = new User("0", "Average", {});
  users.Average.information =
    "This prediction table is an automated average of all other player predictions.";

  users = generateAveragePredictions(drivers, "driver", users);
  users = generateAveragePredictions(teams, "team", users);

  users = orderAveragePredictions(users);

  users = calcUsersPerformance("driver", rounds, users);
  users = calcUsersPerformance("team", rounds, users);

  users = generateControversyData(users);

  rounds = calcLeaderboards("driver", rounds, users);
  rounds = calcLeaderboards("team", rounds, users);

  rounds = orderLeaderboards(rounds);

  rounds = calcLeaderboardRdDiffs(rounds);

  rounds = generateEntrantDiffTotals(rounds, users);

  drivers = getEntrantPredictedPositions(drivers, "driver", users);
  teams = getEntrantPredictedPositions(teams, "team", users);

  drivers = generateTeammateHeadToHead(drivers, teams, users);

  return {
    entrants: { drivers: drivers, teams: teams },
    rounds: rounds,
    lastUpdated: new Date(),
    users: users,
  };
};

/**Get users and their predictions from the database and check all the appropriate data is set */
const getUserData = async (
  drivers: Entrants,
  season: string,
  sport: Sport,
  teams: Entrants
): Promise<Users | string> => {
  let predictionDataRes;
  try {
    const res = await getAllF1PredictionTablesQuery(season, sport);
    predictionDataRes = res.rows;
  } catch (e: unknown) {
    if (e instanceof Error) {
      return e.message;
    }
    return "Unknown database error";
  }
  let error = false;
  const Users: Users = predictionDataRes.reduce((acc, user) => {
    const dbId: string | null = user["id"];
    const dbDisplayName: string | null = user["display_name"];
    const dbDriverPredictions: string[] | null = user["driver_predictions"];
    const dbTeamPredictions: string[] | null = user["team_predictions"];
    if (dbId && dbDisplayName && dbDriverPredictions && dbTeamPredictions) {
      return {
        ...acc,
        [dbDisplayName]: new User(dbId, dbDisplayName, {
          driver: dbDriverPredictions.map((entrant) => drivers[entrant]),
          team: dbTeamPredictions.map((entrant) => teams[entrant]),
        }),
      };
    } else {
      error = true;
      return {};
    }
  }, {} as Record<string, User>);
  if (error) return "Unable construct users from database data";
  return Users;
};

/**Loop over each entrant finding their index in each user's prediction table, calculating an average and then adding it to each entrant as new avgPrePos property */
const generateAveragePredictions = (
  entrants: Entrants,
  entrantType: string,
  users: Users
) => {
  users.Average.predictions[entrantType] = [];
  for (const entrant of Object.values(entrants)) {
    let predictionPosTotal = 0;
    let noOfUsers = 0;
    for (const user of Object.values(users)) {
      predictionPosTotal += user.predictions[entrantType].indexOf(entrant) + 1;
      noOfUsers++;
    }
    entrant.avgPrePos = predictionPosTotal / noOfUsers;
    users.Average.predictions[entrantType].push(entrant);
  }
  return users;
};

//**Sort all 'average' user's predictions by how popular each entrant was */
const orderAveragePredictions = (users: Users): Users => {
  for (const entrantType in users.Average.predictions) {
    users.Average.predictions[entrantType].sort((a, b) =>
      a.avgPrePos! > b.avgPrePos! ? 1 : -1
    );
  }
  return users;
};

//**Based on the user predictions and round data, calculate the differences in entrant predictions for each user, their diff totals and their count of each difference (perfect predictions, predictions that were one off etc) */
const calcUsersPerformance = (
  entrantType: string,
  rounds: Round[],
  users: Users
) => {
  rounds.forEach((round, roundIndex) => {
    /**Loop through each user to generate their entrant differences in this particular round*/
    for (let user of Object.values(users)) {
      if (!user.season[entrantType]) user.season[entrantType] = [];
      /**Push blank round performance ready to fill out with data */
      user.season[entrantType].push({
        diffTotal: 0,
        diffs: [],
        diffCounts: [],
      });
      for (let i = 0; i < user.predictions[entrantType].length; i++) {
        user.season[entrantType][roundIndex].diffCounts.push(0);
      }

      user = calcUserRoundPerformance(entrantType, user, round, roundIndex);
    }
  });

  return users;
};

//**Loop over a user's predictions for a particular round, calc their pos difference from that round's standings */
const calcUserRoundPerformance = (
  entrantType: string,
  user: User,
  round: Round,
  roundIndex: number
): User => {
  for (const [predictedPos, entrant] of Object.entries(
    user.predictions[entrantType]
  )) {
    /**Find the position the user predicted that entrant would come in the standings*/
    const actualPos = round.standings[entrantType].indexOf(entrant);
    /**Work out how many positions the user is off*/
    const posDiff = actualPos - +predictedPos;
    user.season[entrantType][roundIndex].diffCounts[Math.abs(posDiff)]++;
    /**Add the posDiff to their total for this round*/
    user.season[entrantType][roundIndex].diffTotal += Math.abs(posDiff);
    /**Add the entrant and their posDiff to the user's data*/
    user.season[entrantType][roundIndex].diffs.push({
      entrant: entrant,
      posDiff,
    });
  }
  return user;
};

/**Populate the leaderboard for each user in each round*/
const calcLeaderboards = (
  entrantType: string,
  rounds: Round[],
  users: Users
): Round[] => {
  rounds.forEach((round, roundIndex) => {
    if (!round.leaderboards[entrantType]) round.leaderboards[entrantType] = [];

    for (let user of Object.values(users)) {
      round.leaderboards[entrantType].push({
        user: user,
        percentCorrect: calcPredictionsAccuracy(
          user.predictions[entrantType].length,
          user.season[entrantType][roundIndex].diffTotal
        ),
        /**Add 0 previous round performance ready to fill out with data in calcLeaderboardRdDiffs() */
        prevRdDiff: 0,
      });
    }
  });
  return rounds;
};

export const calcPredictionsAccuracy = (
  noOfEntrants: number,
  penaltyPoints: number
): number => {
  let maxDiff = 0;
  noOfEntrants--;
  while (noOfEntrants > 0) {
    maxDiff += noOfEntrants * 2;
    noOfEntrants -= 2;
  }
  return Math.round(((maxDiff - penaltyPoints) / maxDiff) * 100);
};

/** Order leaderboards by percentage correct, then use perfect predictions as tie break, then use predictions that were 1 off as a tie break, then use predictions that were 2 off as a tie break etc */
const orderLeaderboards = (rounds: Round[]) => {
  /** @todo Need to implement people sharing a leaderboard position if they have the same predictions */
  rounds.forEach((round, roundIndex) => {
    for (const entrantType in round.leaderboards) {
      round.leaderboards[entrantType].sort(function (a, b) {
        let order;
        if (a.percentCorrect !== b.percentCorrect) {
          /**Sort by percentage correct, highest first*/
          return a.percentCorrect < b.percentCorrect
            ? (order = 1)
            : (order = -1);
        } else {
          for (let i = 0; i < round.standings[entrantType].length; i++) {
            /**If a has bigger diffCount than b return 1*/
            if (
              a.user.season[entrantType][roundIndex].diffCounts[i] <
              b.user.season[entrantType][roundIndex].diffCounts[i]
            ) {
              order = 1;
              break;
            } else if (
              /**If b has bigger diffCount than a return -1*/
              a.user.season[entrantType][roundIndex].diffCounts[i] >
              b.user.season[entrantType][roundIndex].diffCounts[i]
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

/**Calculate how each user's leaderboard position has changed since the previous round */
const calcLeaderboardRdDiffs = (rounds: Round[]): Round[] => {
  rounds.forEach((round, roundIndex) => {
    for (const entrantType in round.leaderboards) {
      /**Don't calculate the leaderboard changes of the first round */
      if (roundIndex === 0) {
        return;
      }
      /**Loop over each user in order of the looped round's leaderboard*/
      for (const [currentLbPos, currentUserData] of Object.entries(
        round.leaderboards[entrantType]
      )) {
        /**Find that user's position in the leaderboard of the round previous to the looped round*/
        const previousLbPos = rounds[roundIndex - 1].leaderboards[
          entrantType
        ].findIndex((entrant) => entrant.user.id === currentUserData.user.id);
        /**Attach the user's leaderboard position change from the previous round to their data for the looped round*/
        currentUserData.prevRdDiff = previousLbPos - +currentLbPos;
      }
    }
  });
  return rounds;
};

/**Calculate how accurately each entrant has been predicted */
const generateEntrantDiffTotals = (rounds: Round[], users: Users): Round[] => {
  /**Loop over rounds to generate the EntrantDiffTotals for each round*/
  rounds.forEach((round, roundIndex) => {
    for (const entrantType in round.leaderboards) {
      if (!round.entrantDiffTotals[entrantType])
        round.entrantDiffTotals[entrantType] = [];
      /**Loop over users to get their diffs for each entrant*/
      for (const user of Object.values(users)) {
        /**Loop over entrants to add each entrant's diffs to each total before moving onto the next user*/
        for (const entrant of user.predictions[entrantType]) {
          /**If the entrantDiffTotals doesn't already contain an object for the entrant, push {entrant:[entrant], diffTotal:0}*/
          if (
            !round.entrantDiffTotals[entrantType].find(
              (x) => x.entrant === entrant
            )
          ) {
            round.entrantDiffTotals[entrantType].push({
              entrant: entrant,
              diffTotal: 0,
            });
          }
          /**Find entrant in user's predictions for the round*/
          const entrantStanding = user.season[entrantType][
            roundIndex
          ].diffs.find((element) => element.entrant.sName === entrant.sName)!;
          /**Find entrantDiff total*/
          let entrantTotal = rounds[roundIndex].entrantDiffTotals[
            entrantType
          ].find((element) => element.entrant === entrant)!;
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
  entrants: Entrants,
  entrantType: string,
  users: Users
) => {
  const noOfEntrants = Object.keys(entrants).length;
  const noOfUsers = Object.keys(users).length - 1;

  for (const entrant of Object.values(entrants)) {
    /**Create blank position array */
    for (let i = 0; i < noOfEntrants; i++) {
      entrant.predictionedPositions.push(0);
    }
    /**Loop over users, obtain the position index they predicted the entrant in, then plus one to that index in the entrant position array  */
    for (const user of Object.values(users)) {
      if (user.displayName === "Average") continue;
      const userPredictedPos = user.predictions[entrantType].indexOf(entrant);
      entrant.predictionedPositions[userPredictedPos]++;
    }

    /**Turn predictedPositions into percentage */
    entrant.predictionedPositions = entrant.predictionedPositions.map((pos) =>
      Math.round((pos / noOfUsers) * 100)
    );
  }
  return entrants;
};

/**For every user, find their highest predicted driver for each team, total for all users, then convert that to a percentage and attach it to the driver */
const generateTeammateHeadToHead = (
  drivers: Entrants,
  teams: Entrants,
  users: Users
) => {
  const noOfUsers = Object.keys(users).length - 1;
  for (const team of Object.values(teams)) {
    for (const user of Object.values(users)) {
      if (user.displayName === "Average") continue;
      const higherPredictedDriver = user.predictions["driver"].find(
        (driver) => driver.color === team.color
      );
      if (
        typeof higherPredictedDriver?.pcPredictedToBeatTeammate !== "number"
      ) {
        higherPredictedDriver!.pcPredictedToBeatTeammate = 1;
      } else {
        higherPredictedDriver!.pcPredictedToBeatTeammate++;
      }
    }
  }
  for (const driver of Object.values(drivers)) {
    driver.pcPredictedToBeatTeammate = driver.pcPredictedToBeatTeammate
      ? Math.round((driver.pcPredictedToBeatTeammate / noOfUsers) * 100)
      : 0;
  }
  return drivers;
};

/**Calculate how far away each user's predictions are from the average predictions */
export function generateControversyData(users: Users): Users {
  for (const user of Object.values(users)) {
    if (user.displayName === "Average") continue;

    for (const entrantType of Object.keys(user.predictions)) {
      user.predictionsFromAvg[entrantType] = 0;

      for (const [predictedPos, entrant] of Object.entries(
        user.predictions[entrantType]
      )) {
        const avgPredictedPos =
          users.Average.predictions[entrantType].indexOf(entrant);

        const posDiffs = Math.abs(+predictedPos - avgPredictedPos);
        user.predictionsFromAvg[entrantType] += posDiffs;
      }
    }
  }
  return users;
}
