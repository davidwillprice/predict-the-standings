import "dotenv/config";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

import { allSeasonData } from "@data/formula-1/season-data";
import { getAllPredictionData } from "@lib/prediction-data";
import {
  getAllUserPredictionDataQuery,
  updateAllUserDocGameData,
  updateLastUpdatedTimeQuery,
} from "@lib/db-functions";

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

      const predictionData = await getAllPredictionData(
        drivers,
        teams,
        rounds,
        users
      );
      if (typeof predictionData === "string") throw new Error(predictionData);

      await updateAllUserDocGameData(collection, users);

      /**Update/Add the data to the DB */
      const gameDataDoc = {
        type: "gameData",
        entrants: { drivers: drivers, teams: teams },
        rounds: predictionData.rounds,
      };

      const result = await collection.updateOne(
        { type: "gameData" },
        { $set: gameDataDoc },
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
