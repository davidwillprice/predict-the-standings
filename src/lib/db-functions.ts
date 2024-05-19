"use server";
import clientPromise from "@lib/mongodb";
import { Collection } from "mongodb";

import { ObjectId } from "mongodb";
import {
  AllEntrants,
  ShortHandCompStr,
  StatsData,
  UserGameData,
  UserGameDataMap,
} from "@custom-types/game-types";

export const getlastUpdatedDate = async (
  season: string,
  competition: ShortHandCompStr
): Promise<Date> => {
  const client = await clientPromise;
  try {
    const db = client.db("pts");
    const collection = db.collection(competition + season);
    const result = await collection.findOne({ type: "lastUpdatedDate" });
    if (!result)
      throw new Error(
        `Failed to get last updated time for ${competition + season}`
      );

    let lastUpdatedDate: Date = result.lastUpdatedDate;

    return lastUpdatedDate;
  } catch (error) {
    throw error;
  }
};

export const getSingleUserPredictionDataQuery = async (
  season: string,
  competition: ShortHandCompStr,
  userId: string
) => {
  const client = await clientPromise;
  try {
    const db = client.db("pts");
    const collection = db.collection(competition + season);
    const result = await collection.findOne({ userId: userId });
    if (!result)
      throw new Error(
        `Failed to get user prediction data for ${competition + season}`
      );
    return result;
  } catch (error) {
    throw error;
  }
};

/**Get stats data to display on stats pages
 */
export const getMultipleUserGameData = async (
  allEntrants: AllEntrants,
  season: string,
  competition: ShortHandCompStr,
  userIdArr: string[]
): Promise<UserGameDataMap> => {
  const client = await clientPromise;
  try {
    const db = client.db("pts");
    const collection = db.collection(competition + season);
    const result = await collection
      .find({
        userId: { $in: userIdArr },
      })
      .toArray();
    if (!result)
      throw new Error(
        `Failed to get user game data for ${competition + season}`
      );
    /**@todo Refactor the process of coverting the docs to users into a new function*/
    let users: UserGameDataMap = {};
    for await (const doc of result) {
      const predictionsObj: { [entrantType: string]: any } = {};
      Object.keys(allEntrants).forEach((entrantType) => {
        predictionsObj[entrantType] = doc.predictions[entrantType];
      });

      users[doc.userId] = new UserGameData(
        doc.displayName,
        doc.userId,
        doc.lastSubmissionTime,
        predictionsObj,
        doc.userType
      );
      users[doc.userId].userId = doc.userId;
      users[doc.userId].predictionsFromAvg = doc.predictionsFromAvg;
      users[doc.userId].timesPredictionsUpdated = doc.timesPredictionsUpdated;
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

/**Gets user prediction data so it can be processed*/
export const getAllUserPredictionDataQuery = async (
  allEntrants: AllEntrants,
  collection: Collection
): Promise<UserGameDataMap> => {
  try {
    const result = await collection.find({
      type: "userData",
      userType: "standard",
    });
    if (!result)
      throw new Error(
        `Failed to access DB when getting user prediction data for ${collection.collectionName}`
      );

    let users: UserGameDataMap = {};
    for await (const doc of result) {
      const predictionsObj: { [entrantType: string]: any } = {};
      Object.keys(allEntrants).forEach((entrantType) => {
        predictionsObj[entrantType] = doc.predictions[entrantType];
      });

      users[doc.userId] = new UserGameData(
        doc.displayName,
        doc.userId,
        doc.lastSubmissionTime,
        predictionsObj,
        doc.userType
      );
      users[doc.userId].userId = doc.userId;
      users[doc.userId].timesPredictionsUpdated = doc.timesPredictionsUpdated;
    }
    if (Object.keys(users).length === 0)
      console.log(
        `User prediction data obj is empty for ${collection.collectionName}`
      ); // Don't throw error as there may not be user prediction submitted yet

    return users;
  } catch (error) {
    throw error;
  }
};

export const getLeaderboardDataQuery = async (
  competition: ShortHandCompStr,
  entrantType: string,
  roundIndex: number,
  season: string
) => {
  const client = await clientPromise;
  try {
    const db = client.db("pts");
    const collection = db.collection(competition + season);
    const result = await collection
      .find({
        type: "userData",
        [`season.${entrantType}.${roundIndex}.leaderboardPos`]: {
          $gte: 1,
          $lte: 15,
        },
      })
      .toArray();
    if (!result)
      throw new Error(
        `Failed to get leaderboard data for ${competition + season}`
      );

    const users: UserGameDataMap = {};

    result.forEach((user) => {
      users[user.userId] = {
        id: user._id.toString(),
        userId: user.userId,
        displayName: user.displayName,
        controversyPercentile: user.controversyPercentile,
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

/**Get stats data to display on stats pages
 * @todo This should be split into entrant stats and player stats
 */
export const getStatsDataQuery = async (
  season: string,
  competition: ShortHandCompStr
): Promise<StatsData> => {
  const client = await clientPromise;
  try {
    const db = client.db("pts");
    const collection = db.collection(competition + season);
    const result = await collection.findOne({ type: "statsData" });
    if (!result)
      throw new Error(`Failed to get stats data for ${competition + season}`);

    const statsData: StatsData = {
      controversialUserIds: result.controversialUserIds,
      allEntrants: result.allEntrants,
      latestSubmissionUserId: result.latestSubmissionUserId,
      mostUpdatedPredictionUserIds: result.mostUpdatedPredictionUserIds,
      noOfPredictions: result.noOfPredictions,
      rounds: result.rounds,
    };

    console.log("Getting stats data");

    return statsData;
  } catch (error) {
    throw error;
  }
};

/**@todo Update display name in all the user's prediction data for every season/competition they've competed in?*/
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

    // Check the submitted display name is unique regardless of upper and lowercase letters
    const duplicateUser = await usersCollection.findOne({
      displayName: { $regex: new RegExp(submittedDisplayName, "i") }, // 'i' for case-insensitive
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

    ////Update their display name in all their game data
    //Create an array with all the collections which will need to be updated
    let gameDataCollections: string[] = [];
    const predictionsMadeFor: { [competition: ShortHandCompStr]: string[] } =
      existingUser.predictionsMadeFor;
    for (const [competition, seasonArr] of Object.entries(predictionsMadeFor)) {
      seasonArr.forEach((seasonStr) =>
        gameDataCollections.push(competition + seasonStr)
      );
    }
    //Update the user's display name in all collections
    gameDataCollections.forEach((collectionName) => {
      const collection = db.collection(collectionName);
      collection.updateOne(
        {
          userId: userId,
        },
        {
          $set: {
            displayName: submittedDisplayName,
          },
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

export const submitPredictionsQuery = async (
  competition: ShortHandCompStr,
  displayName: string,
  entrantArrs: { [entrantType: string]: string[] },
  season: string,
  userId: string
): Promise<string | void> => {
  const client = await clientPromise;
  try {
    const db = client.db("pts");
    const collection = db.collection(competition + season);

    const predictionFreezeDateDoc = await collection.findOne({
      type: "predictionFreezeDate",
    });

    const predictionFreezeDate = predictionFreezeDateDoc?.predictionFreezeDate;

    if (predictionFreezeDate === undefined)
      throw new Error(
        `Failed to update user prediction data for ${competition + season}`
      );

    if (predictionFreezeDate.getTime() < new Date().getTime()) {
      return `Predictions for ${competition + season} are frozen`;
    } else {
      const olduserPredictionDoc = await collection.findOne({ userId: userId });
      const prevTimesPredictionsUpdated =
        olduserPredictionDoc?.timesPredictionsUpdated;

      const userPredictionDoc = {
        displayName: displayName,
        lastSubmissionTime: new Date(),
        predictions: entrantArrs,
        timesPredictionsUpdated: prevTimesPredictionsUpdated
          ? prevTimesPredictionsUpdated + 1
          : 1,
        type: "userData",
        userId: userId,
        userType: "standard",
      };
      const result = await collection.updateOne(
        { userId: userId },
        { $set: userPredictionDoc },
        { upsert: true }
      );
      addPredictionToUserDataQuery(competition, season, userId);

      if (!result)
        throw new Error(
          `Failed to update user prediction data for ${competition + season}`
        );
    }
  } catch (error) {
    throw error;
  }
};

/**Adds the latest competition/season the user has made predictions for to their user data */
export const addPredictionToUserDataQuery = async (
  competition: ShortHandCompStr,
  seasonStr: string,
  userId: string
): Promise<string | void> => {
  const client = await clientPromise;
  try {
    const db = client.db("pts");
    const collection = db.collection("users");

    await collection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $addToSet: {
          [`predictionsMadeFor.${competition}`]: seasonStr, // Add seasonStr to competition set
        },
      }
    );
  } catch (error) {
    throw error;
  }
};

/**Once new game data has been created, it needs to be attached to the user game data documents in the DB */
export const updateAllUserDocGameData = async (
  collection: Collection,
  users: UserGameDataMap
) => {
  let userArr = Object.values(users);

  /**Standard users only need a couple of properties updated as the rest is already in the DB
   * Special users may not already be in the DB so can't be filtered by their a MongoDB ObjectId and need more data to be added
   */
  const operations = userArr.map((user) => {
    return {
      updateOne: {
        filter: { userId: user.userId },
        update: {
          $set:
            user.userType === "standard"
              ? {
                  controversyPercentile: user.controversyPercentile,
                  predictionsFromAvg: user.predictionsFromAvg,
                  season: user.season,
                }
              : {
                  userId: user.userId,
                  controversyPercentile: user.controversyPercentile,
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

/**Add/Update a lastUpdatedDate document to DB to be used on the leaderboard page */
export const updateLastUpdatedDateQuery = async (collection: Collection) => {
  try {
    const result = await collection.updateOne(
      {
        type: "lastUpdatedDate",
      },
      { $set: { type: "lastUpdatedDate", lastUpdatedDate: new Date() } },
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

/**Add/Update a predictionFreezeDate document in the DB
 * This can be checked when predictions are submitted to the DB to block any that are late
 */
export const updatePredictionFreezeDateQuery = async (
  collection: Collection,
  predictionFreezeDate: Date
) => {
  try {
    const result = await collection.updateOne(
      {
        type: "predictionFreezeDate",
      },
      {
        $set: {
          type: "predictionFreezeDate",
          predictionFreezeDate: predictionFreezeDate,
        },
      },
      { upsert: true }
    );

    if (!result)
      throw new Error(
        `Failed to update/add prediction freeze date document in ${collection.collectionName}`
      );
  } catch (error) {
    throw error;
  }
};
