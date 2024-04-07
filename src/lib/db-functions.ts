"use server";
import { query } from "@lib/db";
import clientPromise from "@lib/mongodb";

import { ObjectId } from "mongodb";
import { Entrant } from "@custom-types/game-types";
import { Sport } from "@custom-types/misc";

export const submitPredictionsQuery = async (
  driverArr: Entrant[],
  season: string,
  sport: Sport,
  teamArr: Entrant[],
  userId: number
) => {
  await query(`INSERT INTO ${sport}_${season} (prediction_id, user_id, driver_predictions, team_predictions, last_submission_time)
  VALUES (${userId}, ${userId}, ARRAY[${driverArr.map(
    (entrant) => `'${entrant.sName}'`
  )}], ARRAY[${teamArr.map((entrant) => `'${entrant.sName}'`)}])
  ON CONFLICT (prediction_id)
  DO UPDATE
  SET user_id = ${userId}, driver_predictions = ARRAY[${driverArr.map(
    (entrant) => `'${entrant.sName}'`
  )}], team_predictions = ARRAY[${teamArr.map(
    (entrant) =>
      `'${entrant.sName}', last_submission_time = ${new Date().getTime()}`
  )}]`);
};

export const getF1PredictionTablesQuery = async (
  season: string,
  sport: Sport,
  userId: number
) => {
  const res = await query(`SELECT driver_predictions, team_predictions
  FROM ${sport}_${season}
  WHERE prediction_id = ${userId}`);
  try {
    return res.rows[0];
  } catch (_) {
    return;
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
      display_name: submittedDisplayName,
      _id: { $ne: userIdObj },
    });
    if (duplicateUser) throw new Error("Display name already exists");

    // Update the user's display name and the time they submitted it
    const updatedUser = await usersCollection.findOneAndUpdate(
      { _id: userIdObj },
      {
        $set: {
          display_name: submittedDisplayName,
          last_display_name_submission: new Date().getTime(),
        },
      }
    );
    if (!updatedUser) throw new Error("Failed to update user");
  } catch (error) {
    throw error;
  }
};
