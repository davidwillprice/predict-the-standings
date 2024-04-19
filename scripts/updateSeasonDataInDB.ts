import "dotenv/config";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

import { allSeasonData } from "@data/formula-1/season-data";
import { DbRound, Users, User } from "@custom-types/game-types";
import { getAllPredictionData } from "@lib/prediction-data";

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

      let users: Users = {};
      for await (const doc of await collection.find({
        type: "userData",
        userType: "standard",
      })) {
        users[doc._id.toString()] = new User(
          doc.displayName,
          doc._id.toString(),
          doc.lastSubmissionTime,
          {
            driver: doc.predictions.driver,
            team: doc.predictions.team,
          },
          doc.userType
        );
      }

      const predictionData = await getAllPredictionData(
        drivers,
        teams,
        rounds,
        users
      );
      if (typeof predictionData === "string") throw new Error(predictionData);
      //console.log(predictionData);

      /**Label entrants with a manual MongoDB so they can be referenced elsewhere */
      Object.keys(drivers).forEach((key) => {
        drivers[key]["_id"] = new ObjectId();
      });
      Object.keys(teams).forEach((key) => {
        teams[key]["_id"] = new ObjectId();
      });

      /**Convert update local round data ready to upload to the DB */
      const dbRounds: DbRound[] = [];
      for (const round of rounds) {
        dbRounds.push({
          trackName: round.trackName,
          standings: {
            driver: round.standings.driver.map((entrantStr) => {
              /**Replace sName entrant strings in round arrays to reference entrant objects */
              try {
                return drivers[entrantStr]._id;
              } catch (_) {
                throw new Error(
                  `Couldn't match an round standing entrant '${entrantStr}'`
                );
              }
            }),
            team: round.standings.team.map((entrantStr) => {
              /**Replace sName entrant strings in round arrays to reference entrant objects */
              try {
                return teams[entrantStr]._id;
              } catch (_) {
                throw new Error(
                  `Couldn't match an round standing entrant '${entrantStr}'`
                );
              }
            }),
          },
        });
      }

      /**Update/Add the data to the DB */

      const gameDataDoc = {
        type: "gameData",
        entrants: { drivers: drivers, teams: teams },
        rounds: dbRounds,
      };
      const result = await collection.updateOne(
        { type: "gameData" },
        { $set: gameDataDoc },
        { upsert: true }
      );
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
  } catch (err) {
    console.error(err);
  }
}

run();
