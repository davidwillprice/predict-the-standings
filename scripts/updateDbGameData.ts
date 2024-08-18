import "dotenv/config";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

import { allEurovisionSeasonData } from "@data/eurovision/season-data";
import { allF1SeasonData } from "@data/formula-1/season-data";
import { allPlSeasonData } from "@data/premier-league/season-data";
import { createGameData } from "@lib/game-data";
import {
  getAllUserPredictionDataQuery,
  updateAllUserDocGameData,
  updateLastUpdatedDateQuery,
  updateNoOfPredictionsQuery,
  updatePredictionFreezeDateQuery,
  updateStatsDataQuery,
} from "@lib/db-functions";
import { statsDataObjId } from "@data/object-ids";

import { AllLocalSeasonData } from "@custom-types/game-types";

async function connectToMongo() {
  if (process.env.db === "dev")
    dotenv.config({ path: ".env.development", override: true });
  if (!process.env.MONGODB_URI) throw Error("MongoDB URL not found");
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  return client;
}

async function submitCompetitionGameData(
  allSeasonData: AllLocalSeasonData,
  client: MongoClient
) {
  const db = client.db("pts");
  /**Loop over each season and update its data within the database */
  for (const seasonData of Object.values(allSeasonData)) {
    const {
      allEntrants,
      arePredictionsFrozen,
      isGameDataLocked,
      competitionStrs,
      id: seasonStr,
      predictionFreezeDate,
      rounds,
    } = seasonData;

    if (isGameDataLocked) {
      console.log(
        `${competitionStrs.shortHand}${seasonStr} is complete and its database collection is locked`
      );
      continue;
    }

    if (!arePredictionsFrozen && rounds.length > 0) {
      throw new Error(
        `Freeze predictions before adding round data for ${
          competitionStrs.shortHand + seasonStr
        }`
      );
    }

    /**@todo Fix type any - I would like it to be Collection<UserGameData> but that breaks other querys */
    const collection: any = db.collection(
      competitionStrs.shortHand + seasonStr
    );

    await updatePredictionFreezeDateQuery(collection, predictionFreezeDate);

    /**Get all existing user game data from the DB */
    const users = await getAllUserPredictionDataQuery(collection);

    /**Combine local season data with existing user game data*/
    const gameData = await createGameData(
      allEntrants,
      competitionStrs.shortHand,
      seasonData,
      users
    );
    if (typeof gameData === "string") throw new Error(gameData);

    /**Update/Add user game data to the DB */
    await updateAllUserDocGameData(collection, users);

    const noOfPredictions: { [entrantType: string]: number } = {};
    for (const entrantType in allEntrants) {
      noOfPredictions[entrantType] = Object.keys(users).length;
    }

    await updateNoOfPredictionsQuery(collection, noOfPredictions);

    await updateStatsDataQuery(collection, gameData, noOfPredictions);

    /**If everything has updated okay up to this point, log when this update happened in the DB */
    await updateLastUpdatedDateQuery(collection);
  }
}

async function run() {
  const client = await connectToMongo();
  try {
    await submitCompetitionGameData(allF1SeasonData, client);
    await submitCompetitionGameData(allEurovisionSeasonData, client);
    await submitCompetitionGameData(allPlSeasonData, client);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1); //Hack to ensure the client closes
  } finally {
    await client.close();
  }
}

run();
