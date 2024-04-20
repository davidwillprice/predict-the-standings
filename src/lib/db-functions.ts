"use server";
import clientPromise from "@lib/mongodb";
import { Collection } from "mongodb";

import { ObjectId } from "mongodb";
import { Sport } from "@custom-types/misc";
import { User, Users } from "@custom-types/game-types";

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

export const getAllUserPredictionDataQuery = async (
  collection: Collection,
  season: string,
  sport: Sport
) => {
  try {
    const result = await collection.find({
      type: "userData",
      userType: "standard",
    });
    if (!result)
      throw new Error(
        `Failed to access DB when getting user prediction data for ${
          sport + season
        }`
      );

    let users: Users = {};
    for await (const doc of result) {
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
    if (Object.keys(users).length === 0)
      throw new Error(
        `User prediction data obj is empty for ${sport + season}`
      );

    return users;
  } catch (error) {
    throw error;
  }
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
      lastSubmissionTime: new Date(),
      predictions: { driver: driverArr, team: teamArr },
      type: "userData",
      userId: userId,
      userType: "standard",
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
