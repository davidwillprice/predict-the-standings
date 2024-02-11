import { getAllPredictionTablesQuery } from "./db-functions";
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
  entrants: Entrants,
  rounds: Round[],
  season: string,
  sport: Sport
): Promise<PredictionData | null> => {
  let users = await getUserData(entrants, season, sport);

  //**If getUsersData didn't generate valid data, return null so an error can be displayed in the UI */
  if (!users) return null;

  //**Creates an 'average' user */
  users.average = new User("0", "average", []);
  users = generateAverageTable(entrants, users);
  users = orderAverageTable(users);

  users = calcUserData(rounds, users);

  rounds = calcLeaderboards(rounds, users);

  rounds = orderLeaderboards(rounds);

  rounds = calcLeaderboardRdDiffs(rounds);

  rounds = generateEntrantDiffTotals(rounds, users);

  return { rounds: rounds, users: users };
};

/**Get users and their predictions from the database and check all the appropriate data is set */
const getUserData = async (
  entrants: Entrants,
  season: string,
  sport: Sport
): Promise<Users | null> => {
  const predictonDataRes = await getAllPredictionTablesQuery(season, sport);
  let error = false;
  const Users: Users = predictonDataRes.reduce((acc, user) => {
    const dbId: string | null = user["id"];
    const dbDisplayName: string | null = user["display_name"];
    const dbPredictions: string[] | null = user["predictions"];
    if (dbId && dbDisplayName && dbPredictions) {
      return {
        ...acc,
        [dbDisplayName]: new User(
          dbId,
          dbDisplayName,
          dbPredictions.map((entrant) => entrants[entrant])
        ),
      };
    } else {
      error = true;
      return {};
    }
  }, {} as Record<string, User>);
  if (error) return null;
  return Users;
};

/**Loop over each entrant finding their index in each user's prediction table, calculating an average and then adding it to each entrant as new avgPrePos property */
const generateAverageTable = (entrants: Entrants, users: Users) => {
  for (const entrant of Object.values(entrants)) {
    let predictionPosTotal = 0;
    let noOfUsers = 0;
    for (const user of Object.values(users)) {
      predictionPosTotal += user.predictions.indexOf(entrant) + 1;
      noOfUsers++;
    }
    entrant.avgPrePos = predictionPosTotal / noOfUsers;
    users.average.predictions.push(entrant);
  }
  return users;
};

//**Sort 'average' user by their percentage correct, highest first */
const orderAverageTable = (user: Users): Users => {
  user.average.predictions.sort((a, b) =>
    a.avgPrePos! > b.avgPrePos! ? 1 : -1
  );
  return user;
};

//**Based on the user predictions and round data, calculate the differences in entrant predictions for each user, their diff totals and their count of each difference (perfect predictions, predictions that were one off etc) */
const calcUserData = (rounds: Round[], users: Users) => {
  rounds.forEach((round, roundIndex) => {
    /**Loop through each user to generate their entrant differences in this particular round*/
    for (let user of Object.values(users)) {
      /**Push blank round performance ready to fill out with data */
      user.season.push({
        diffTotal: 0,
        diffs: [],
        diffCounts: [],
      });
      for (let i = 0; i < user.predictions.length; i++) {
        user.season[roundIndex].diffCounts.push(0);
      }

      user = calcUserRoundPerformance(user, round, roundIndex);
    }
  });
  return users;
};

//**Loop over a user's predictions for a particular round, calc their pos difference from that round's standings */
const calcUserRoundPerformance = (
  user: User,
  round: Round,
  roundIndex: number
): User => {
  for (const [predictedPos, entrant] of Object.entries(user.predictions)) {
    /**Find the position the user predicted that entrant would come in the standings*/
    const actualPos = round.standings.indexOf(entrant);
    /**Work out how many positions the user is off*/
    const posDiff = actualPos - +predictedPos;
    user.season[roundIndex].diffCounts[Math.abs(posDiff)]++;
    /**Add the posDiff to their total for this round*/
    user.season[roundIndex].diffTotal += Math.abs(posDiff);
    /**Add the entrant and their posDiff to the user's data*/
    user.season[roundIndex].diffs.push({
      entrant: entrant,
      posDiff,
    });
  }
  return user;
};

/**Populate leaderboard for each user in each round, populating the round.leaderboards*/
const calcLeaderboards = (rounds: Round[], users: Users): Round[] => {
  rounds.forEach((round, roundIndex) => {
    for (let user of Object.values(users)) {
      round.leaderboards.push({
        user: user,
        percentCorrect: calcPredictionsAccuracy(
          user.predictions.length,
          user.season[roundIndex].diffTotal
        ),
        /**Add 0 previous round performance ready to fill out with data in calcLeaderboardRdDiffs() */
        prevRdDiff: 0,
      });
    }
  });
  return rounds;
};

const calcPredictionsAccuracy = (
  noOfEntrants: number,
  penaltyPoints: number
): number => {
  /**@todo Rework out how to calculate this from the noOfEntrants */
  const maxDiff = 200;

  return Math.round(((maxDiff - penaltyPoints) / maxDiff) * 100);
};

/** Order leaderboards by percentage correct, then use perfect predictions as tie break, then use predictions that were 1 off as a tie break, then use predictions that were 2 off as a tie break etc */
const orderLeaderboards = (rounds: Round[]) => {
  rounds.forEach((round, roundIndex) => {
    round.leaderboards.sort(function (a, b) {
      let order;
      if (a.percentCorrect !== b.percentCorrect) {
        /**Sort by percentage correct, highest first*/
        return a.percentCorrect < b.percentCorrect ? (order = 1) : (order = -1);
      } else {
        for (let i = 0; i < round.standings.length; i++) {
          /**If a has bigger diffCount than b return 1*/
          if (
            a.user.season[roundIndex].diffCounts[i] <
            b.user.season[roundIndex].diffCounts[i]
          ) {
            order = 1;
            break;
          } else if (
            /**If b has bigger diffCount than a return -1*/
            a.user.season[roundIndex].diffCounts[i] >
            b.user.season[roundIndex].diffCounts[i]
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
  });
  return rounds;
};

/**Calculate how each user's leaderboard position has changed since the previous round */
const calcLeaderboardRdDiffs = (rounds: Round[]): Round[] => {
  rounds.forEach((round, roundIndex) => {
    /**Don't calculate the leaderboard changes of the first round */
    if (roundIndex > 0) {
      /**Loop over each user in order of the looped round's leaderboard*/
      for (const [currentLbPos, currentUserData] of Object.entries(
        round.leaderboards
      )) {
        /**Find that user's position in the leaderboard of the round previous to the looped round*/
        const previousLbPos = rounds[roundIndex].leaderboards.findIndex(
          (entrant) => entrant.user.id === currentUserData.user.id
        );
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
    /**Loop over users to get their diffs for each entrant*/
    for (const user of Object.values(users)) {
      /**Loop over entrants to add each entrant's diffs to each total before moving onto the next user*/
      for (const entrant of user.predictions) {
        /**If the entrantDiffTotals doesn't already contain an object for the entrant, push {entrant:[entrant], diffTotal:0}*/
        if (!round.entrantDiffTotals.find((x) => x.entrant === entrant)) {
          round.entrantDiffTotals.push({
            entrant: entrant,
            diffTotal: 0,
          });
        }
        /**Find entrant in user's predictions for the round*/
        const entrantStanding = user.season[roundIndex].diffs.find(
          (element) => element.entrant.sName === entrant.sName
        )!;
        /**Find entrantDiff total*/
        let entrantTotal = rounds[roundIndex].entrantDiffTotals.find(
          (element) => element.entrant === entrant
        )!;
        /**Add entrantStanding.posDiff to entrant's diff total*/
        entrantTotal.diffTotal += Math.abs(entrantStanding.posDiff);
      }
    }
    /**Sort least and most accurate entrants by their diff totals */
    round.entrantDiffTotals.sort((a, b) =>
      a.diffTotal > b.diffTotal ? 1 : -1
    );
  });
  return rounds;
};
