import "dotenv/config";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

import { allF1SeasonData } from "@data/formula-1/season-data";
import { allEurovisionSeasonData } from "@data/eurovision/season-data";
import { createGameData } from "@lib/prediction-data";
import {
  getAllUserPredictionDataQuery,
  updateAllUserDocGameData,
  updateLastUpdatedDateQuery,
} from "@lib/db-functions";
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
  try {
    const db = client.db("pts");
    /**Loop over each season and update its data within the database */
    for (const [seasonStr, seasonData] of Object.entries(allSeasonData)) {
      const { allEntrants, competition, rounds } = seasonData;

      const collection = db.collection(competition + seasonStr);

      const users = await getAllUserPredictionDataQuery(
        allEntrants,
        collection
      );

      const gameData = await createGameData(
        allEntrants,
        competition,
        rounds,
        users
      );
      if (typeof gameData === "string") throw new Error(gameData);

      await updateAllUserDocGameData(collection, users);

      const noOfPredictions: { [entrantType: string]: number } = {};
      for (const entrantType in allEntrants) {
        noOfPredictions[entrantType] = Object.keys(users).length;
      }

      /**Update/Add the stats data to the DB */
      const result = await collection.updateOne(
        { type: "statsData" },
        {
          $set: {
            type: "statsData",
            controversialUserIds: gameData.controversialUserIds,
            allEntrants: gameData.allEntrantStats,
            noOfPredictions: noOfPredictions,
            rounds: gameData.roundStats,
          },
        },
        { upsert: true }
      );

      await updateLastUpdatedDateQuery(collection);

      console.log(
        `An ${collection.collectionName} gameData document was ${
          result.upsertedId ? "inserted" : "updated"
        }`
      );
    }
  } finally {
    await client.close();
  }
}

async function run() {
  try {
    const client = await connectToMongo();
    await submitCompetitionGameData(allF1SeasonData, client);
    await submitCompetitionGameData(allEurovisionSeasonData, client);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
