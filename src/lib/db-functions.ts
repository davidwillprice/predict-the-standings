"use server";
import clientPromise from "@lib/mongodb";
import { Collection } from "mongodb";

import { ObjectId } from "mongodb";
import { Sport } from "@custom-types/misc";
import { User, Users, StatsData } from "@custom-types/game-types";

export const getSingleUserPredictionDataQuery = async (
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

/**Gets user prediction data so it can be processed*/
export const getAllUserPredictionDataQuery = async (
  collection: Collection
): Promise<Users> => {
  try {
    const result = await collection.find({
      type: "userData",
      userType: "standard",
    });
    if (!result)
      throw new Error(
        `Failed to access DB when getting user prediction data for ${collection.collectionName}`
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
        `User prediction data obj is empty for ${collection.collectionName}`
      );

    return users;
  } catch (error) {
    throw error;
  }
};

export const getLeaderboardDataQuery = async (season: string, sport: Sport) => {
  const client = await clientPromise;
  try {
    const db = client.db("pts");
    const collection = db.collection(sport + season);
    const result = await collection.find({ type: "userData" }).toArray();
    if (!result)
      throw new Error(`Failed to get leaderboard data for ${sport + season}`);

    const users: { [key: string]: User } = {};

    result.forEach((user) => {
      users[user.userId] = {
        id: user.userId,
        displayName: user.displayName,
        information: user.information,
        lastSubmissionTime: user.lastSubmissionTime,
        predictions: user.predictions,
        predictionsFromAvg: user.predictionsFromAvg,
        season: user.season,
        userType: user.userType,
      };
    });

    console.log("Getting leaderboard data");

    return users;
  } catch (error) {
    throw error;
  }
};

/**Get stats data to display on stats pages */
export const getStatsDataQuery = async (season: string, sport: Sport) => {
  const client = await clientPromise;
  try {
    const db = client.db("pts");
    const collection = db.collection(sport + season);
    const result = await collection.findOne({ type: "statsData" });
    if (!result)
      throw new Error(`Failed to get stats data for ${sport + season}`);

    const statsData: StatsData = {
      entrantStats: result.entrants,
      noOfPredictions: result.noOfPredictions,
      roundStats: result.rounds,
    };

    console.log("Getting stats data");

    return statsData;
  } catch (error) {
    throw error;
  }
};

/**@todo Update display name in all the user's prediction data for every season/sport they've competed in? */
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

/**Once new game data has been created, it needs to be attached to the user game data documents in the DB */
export const updateAllUserDocGameData = async (
  collection: Collection,
  users: Users
) => {
  let userArr = Object.values(users);

  /**Standard users only need a couple of properties updated as the rest is already in the DB
   * Special users may not already be in the DB so can't be filtered by their a MongoDB ObjectId and need more data to be added
   */
  const operations = userArr.map((user) => {
    return {
      updateOne: {
        filter:
          user.userType === "standard"
            ? { _id: new ObjectId(user.id) }
            : { userId: user.id },
        update: {
          $set:
            user.userType === "standard"
              ? {
                  predictionsFromAvg: user.predictionsFromAvg,
                  season: user.season,
                }
              : {
                  userId: user.id,
                  displayName: user.displayName,
                  information: user.information,
                  predictions: user.predictions,
                  predictionsFromAvg: user.predictionsFromAvg,
                  season: user.season,
                  type: "userData",
                  userType: "special",
                },
        },
        upsert: true,
      },
    };
  });

  const res = await collection.bulkWrite(operations);
  if (userArr.length !== res.matchedCount + res.upsertedCount)
    throw new Error(
      `Expected to find/add ${userArr.length} user(s) to update/add their game data for standard ${collection.collectionName}, but only found/added ${res.matchedCount}`
    );
};

/**Add/Update a LastUpdatedTime document to DB to be used on the leaderboard page */
export const updateLastUpdatedTimeQuery = async (collection: Collection) => {
  try {
    const result = await collection.updateOne(
      {
        type: "lastUpdatedTime",
      },
      { $set: { type: "lastUpdatedTime", lastUpdatedTime: new Date() } },
      { upsert: true }
    );

    if (!result)
      throw new Error(
        `Failed to update/add last updated document in ${collection.collectionName}`
      );
  } catch (error) {
    throw error;
  }
};
