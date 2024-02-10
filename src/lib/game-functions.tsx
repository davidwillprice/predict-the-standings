import { getAllPredictionTablesQuery } from "./db-functions";
/**@todo Bring all data into a single file so different seasons and sports can be obtained automatically */
import { rounds, entrants } from "@data/formula-1/2024";

import { Sport } from "@custom-types/misc";
import { User, Users, Entrants } from "@custom-types/game-types";

export const getAllPredictonData = async (season: string, sport: Sport) => {
  let users = await getUserData(season, sport);

  if (!users) return null;

  //users = generateAverageTable(users, entrants);
  return users;
};

/**Get users and their predictions from the database and check all the appropriate data is set */
const getUserData = async (
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
        [dbDisplayName]: {
          id: dbId,
          displayName: dbDisplayName,
          predictions: dbPredictions.map((entrant) => entrants[entrant]),
        },
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
export function generateAverageTable(users: Users, entrants: Entrants) {
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
}
