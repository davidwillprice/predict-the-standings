import "dotenv/config";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

const { allSeasonData } = require("../src/data/formula-1/season-data.ts");

async function connectToMongo() {
  if (process.env.db === "dev")
    dotenv.config({ path: ".env.development", override: true });
  if (!process.env.MONGODB_URI) throw Error("MongoDB URL not found");
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  return client;
}

async function insertRecord(client: MongoClient) {
  try {
    const db = client.db("pts");

    const collection = db.collection("f12024");
    const doc = {
      name: allSeasonData["2024"].drivers.ham.name,
      number: allSeasonData["2024"].drivers.ham.id,
    };

    const result = await collection.insertOne(doc);

    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    await client.close();
  }
}

async function run() {
  try {
    const client = await connectToMongo();
    await insertRecord(client);
  } catch (err) {
    console.error(err);
  }
}

run();
