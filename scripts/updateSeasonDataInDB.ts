import "dotenv/config";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { allSeasonData } from "@data/formula-1/season-data";

async function connectToMongo() {
  if (process.env.db === "dev")
    dotenv.config({ path: ".env.development", override: true });
  if (!process.env.MONGODB_URI) throw Error("MongoDB URL not found");
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  return client;
}

async function submitF1GameData(client: MongoClient) {
  try {
    console.log(allSeasonData);
    const db = client.db("pts");
    //**Loop over each F1 season and update its data within the database */
    for (const [seasonStr, seasonData] of Object.entries(allSeasonData)) {
      const collection = db.collection(`f1${seasonStr}`);
      const gameDataDoc = {
        type: "gameData",
        entrants: { drivers: seasonData.drivers, teams: seasonData.teams },
        rounds: seasonData.rounds,
      };
      const result = await collection.insertOne(gameDataDoc);
      console.log(
        `An F1${seasonStr} gameData document was inserted with the _id: ${result.insertedId}`
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
  } catch (err) {
    console.error(err);
  }
}

run();
