"use server";
import { query } from "@lib/db";
import clientPromise from "@lib/mongodb";

import { ObjectId } from "mongodb";
import { Sport } from "@custom-types/misc";

export const submitPredictionsQuery = async (
  displayName: string,
  driverArr: string[],
  season: string,
  sport: Sport,
  teamArr: string[],
  userId: string
) => {
  const client = await clientPromise;
  try {
    const db = client.db("pts");
    const collection = db.collection(sport + season);
    const userPredictionDoc = {
      displayName: displayName,
      lastUpdated: new Date(),
      predictions: { driver: driverArr, team: teamArr },
      type: "userData",
      userId: userId,
    };
    const result = await collection.updateOne(
      { userId: userId },
      { $set: userPredictionDoc },
      { upsert: true }
    );

    if (!result)
      throw new Error(
        `Failed to update user prediction data for ${sport + season}`
      );
    return result;
  } catch (error) {
    throw error;
  }
};

export const getUserPredictionDataQuery = async (
  season: string,
  sport: Sport,
  userId: number
) => {
  const client = await clientPromise;
  try {
    const db = client.db("pts");
    const collection = db.collection(sport + season);
    const result = await collection.findOne({ userId: userId });
    if (!result)
      throw new Error(
        `Failed to get user prediction data for ${sport + season}`
      );
    return result;
  } catch (error) {
    throw error;
  }
};

export const getAllDisplayNamesQuery = async () => {
  console.log(
    `Running DB query to get display names at ${new Date().toISOString()}`
  );
  return await query(`SELECT
  users.id, 
  users.display_name
  FROM users
  ORDER BY users.id;`);
};

export const submitDisplayNameQuery = async (
  submittedDisplayName: string,
  userId: string
) => {
  const client = await clientPromise;
  try {
    const db = client.db("pts");
    const usersCollection = db.collection("users");
    const userIdObj = new ObjectId(userId);

    // Find the user submitting a display name in DB
    const existingUser = await usersCollection.findOne({
      _id: userIdObj,
    });
    if (!existingUser) throw new Error("User not found");

    // Check the submitted display name is unique
    const duplicateUser = await usersCollection.findOne({
      displayName: submittedDisplayName,
      _id: { $ne: userIdObj },
    });
    if (duplicateUser) throw new Error("Display name already exists");

    // Update the user's display name and the time they submitted it
    const updatedUser = await usersCollection.findOneAndUpdate(
      { _id: userIdObj },
      {
        $set: {
          displayName: submittedDisplayName,
          lastDisplayNameSubmission: new Date(),
        },
      }
    );
    if (!updatedUser) throw new Error("Failed to update user");
  } catch (error) {
    throw error;
  }
};
