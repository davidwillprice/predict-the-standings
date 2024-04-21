import "dotenv/config";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

import { allSeasonData } from "@data/formula-1/season-data";
import { createGameData } from "@lib/prediction-data";
import {
  getAllUserPredictionDataQuery,
  updateAllUserDocGameData,
  updateLastUpdatedTimeQuery,
} from "@lib/db-functions";

import { entrantStats } from "@custom-types/game-types";

async function connectToMongo() {
  if (process.env.db === "dev")
    dotenv.config({ path: ".env.development", override: true });
  if (!process.env.MONGODB_URI) throw Error("MongoDB URL not found");
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  return client;
}

async function submitF1GameData(client: MongoClient) {
  try {
    const db = client.db("pts");
    /**Loop over each F1 season and update its data within the database */
    for (const [seasonStr, seasonData] of Object.entries(allSeasonData)) {
      const { drivers, rounds, teams } = seasonData;

      const collection = db.collection(`f1${seasonStr}`);

      const users = await getAllUserPredictionDataQuery(collection);

      const predictionData = await createGameData(
        drivers,
        teams,
        rounds,
        users
      );
      if (typeof predictionData === "string") throw new Error(predictionData);

      await updateAllUserDocGameData(collection, users);

      const driverStats: entrantStats = {};
      Object.values(drivers).forEach((entrant) => {
        driverStats[entrant.sName] = {
          avgPrePos: entrant.avgPrePos,
          predictionedPositions: entrant.predictionedPositions,
          pcPredictedToBeatTeammate: entrant.pcPredictedToBeatTeammate,
        };
      });
      const teamStats: entrantStats = {};
      Object.values(teams).forEach((entrant) => {
        teamStats[entrant.sName] = {
          avgPrePos: entrant.avgPrePos,
          predictionedPositions: entrant.predictionedPositions,
          pcPredictedToBeatTeammate: entrant.pcPredictedToBeatTeammate,
        };
      });

      const roundStats = predictionData.rounds.map((round) => {
        return {
          entrantDiffTotals: round.entrantDiffTotals,
        };
      });

      /**Update/Add the stats data to the DB */
      const result = await collection.updateOne(
        { type: "statsData" },
        {
          $set: {
            type: "statsData",
            entrants: { drivers: driverStats, teams: teamStats },
            rounds: roundStats,
          },
        },
        { upsert: true }
      );

      await updateLastUpdatedTimeQuery(collection);

      console.log(
        `An f1${seasonStr} gameData document was ${
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
    await submitF1GameData(client);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
