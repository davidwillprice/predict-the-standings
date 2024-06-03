"use server";
import clientPromise from "@lib/mongodb";
import { Collection } from "mongodb";
import { ObjectId } from "mongodb";

import {
  convertDocArrToGameDataMap,
  convertDocArrToUserGameDataMap,
  convertDocumentToUserGameData,
  getCollectionObjFromPredictionsMadeFor,
} from "./misc";
import {
  lastUpdatedDateObjId,
  noOfPredictionsObjId,
  predictionFreezeDateObjId,
  statsDataObjId,
} from "@data/object-ids";

import {
  EntrantId,
  GameDataMap,
  NoOfPredictions,
  RoundPerformance,
  ShortHandCompStr,
  StatsData,
  UserGameData,
  UserGameDataMap,
} from "@custom-types/game-types";
import { UserDataFromSession } from "@custom-types/misc";

export const getlastUpdatedDate = async (
  season: string,
  competition: ShortHandCompStr
): Promise<Date> => {
  const client = await clientPromise;
  try {
    const db = client.db("pts");
    const collection = db.collection(competition + season);
    const result = await collection.findOne({
      _id: new ObjectId(lastUpdatedDateObjId),
    });
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

export const getNoOfPredictionsQuery = async (
  season: string,
  shortHandCompStr: ShortHandCompStr
): Promise<NoOfPredictions> => {
  const client = await clientPromise;
  try {
    const db = client.db("pts");
    const collection = db.collection(shortHandCompStr + season);
    const result = await collection.findOne({
      _id: new ObjectId(noOfPredictionsObjId),
    });
    if (!result)
      throw new Error(
        `Failed to get number of predictions for ${shortHandCompStr + season}`
      );

    let noOfPredictions: NoOfPredictions = result.noOfPredictions;

    return noOfPredictions;
  } catch (error) {
    throw error;
  }
};

export const getUserGameDataQuery = async (
  season: string,
  competition: ShortHandCompStr,
  gameDataId: string
): Promise<UserGameData> => {
  const client = await clientPromise;
  try {
    const db = client.db("pts");
    const collection = db.collection<UserGameData>(competition + season);
    const res = await collection.findOne({
      _id: new ObjectId(gameDataId),
    });
    if (!res)
      throw new Error(
        `Failed to get user prediction data for ${competition + season}`
      );
    const user = convertDocumentToUserGameData(res);
    console.log("Returning single userGameData");
    return user;
  } catch (error) {
    throw error;
  }
};

/**Get stats data to display on stats pages */
export const getMultipleUserGameData = async (
  season: string,
  competition: ShortHandCompStr,
  gameDataIdArr: string[]
): Promise<GameDataMap> => {
  const client = await clientPromise;

  try {
    const db = client.db("pts");
    const collection = db.collection<UserGameData>(competition + season);

    /**Change _id string arr into a _id ObjectId arr */
    const gameDataObjIdArr = gameDataIdArr.map((_id) => new ObjectId(_id));

    const result = await collection
      .find({
        _id: { $in: gameDataObjIdArr },
      })
      .toArray();
    if (!result)
      throw new Error(
        `Failed to get user game data for ${competition + season}`
      );

    const gameDataMap = convertDocArrToGameDataMap(result);

    if (Object.keys(gameDataMap).length === 0)
      throw new Error(
        `User prediction data obj is empty for ${collection.collectionName}`
      );

    return gameDataMap;
  } catch (error) {
    throw error;
  }
};

/**Gets all user prediction data from DB so it can be processed (Excluding average)*/
export const getAllUserPredictionDataQuery = async (
  collection: Collection<UserGameData>
): Promise<UserGameDataMap> => {
  try {
    const result = await collection
      .find({
        type: "userData",
        displayName: { $ne: "Average" },
      })
      .toArray();
    if (!result)
      throw new Error(
        `Failed to access DB when getting user prediction data for ${collection.collectionName}`
      );

    const users = convertDocArrToUserGameDataMap(result);
    if (Object.keys(users).length === 0)
      console.log(
        `User prediction data obj is empty for ${collection.collectionName}`
      ); // Just warn dev, don't throw error as there may not be user prediction submitted yet

    return users;
  } catch (error) {
    throw error;
  }
};

export const getLeaderboardDataQuery = async (
  competition: ShortHandCompStr,
  entrantType: string,
  noOfPredictions: number,
  page: number,
  roundIndex: number,
  season: string,
  usersPerPage: number
) => {
  const client = await clientPromise;
  try {
    const maxLeaderboardPos = page * usersPerPage;
    /**If there will be less than the standard number of users per page, instead get the bottom 8 users */
    const minLeaderboardPos =
      maxLeaderboardPos > noOfPredictions
        ? noOfPredictions - (usersPerPage - 1)
        : page * usersPerPage - (usersPerPage - 1);

    const db = client.db("pts");
    const collection = db.collection<UserGameData>(competition + season);
    const result = await collection
      .find({
        type: "userData",
        [`season.${entrantType}.${roundIndex}.leaderboardPos`]: {
          $gte: minLeaderboardPos,
          $lte: maxLeaderboardPos,
        },
      })
      .toArray();
    if (!result)
      throw new Error(
        `Failed to get leaderboard data for ${competition + season}`
      );

    const users = convertDocArrToUserGameDataMap(result);

    if (Object.keys(users).length === 0)
      throw new Error(
        `User prediction data obj is empty for ${collection.collectionName}`
      );

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
    const result = await collection.findOne({
      _id: new ObjectId(statsDataObjId),
    });
    if (!result)
      throw new Error(`Failed to get stats data for ${competition + season}`);

    const statsData: StatsData = {
      allEntrants: result.allEntrantStats,
      controversialGameDataIdMap: result.controversialGameDataIdMap,
      lastSubmittedGameDataId: result.lastSubmittedGameDataId,
      leaderboardToppingGameDataIdMap: result.leaderboardToppingGameDataIdMap,
      mostUpdatedGameDataIdArr: result.mostUpdatedGameDataIdArr,
      noOfPredictions: result.noOfPredictions,
      rounds: result.roundStats,
    };

    console.log("Getting stats data");

    return statsData;
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
    const usersCollection = db.collection<UserDataFromSession>("users");
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

    /**Create an array of all the _id's of the user's predictions and their collection names so the display name can be updated there */
    const gameDataCollectionObjArr =
      getCollectionObjFromPredictionsMadeFor(updatedUser);

    //If they haven't made any predictions, skip this
    if (gameDataCollectionObjArr) {
      //Update the user's display name in all collections
      gameDataCollectionObjArr.forEach((collectionObj) => {
        const collection = db.collection(collectionObj.collectionName);
        collection.updateOne(
          {
            _id: new ObjectId(collectionObj._id),
          },
          {
            $set: {
              displayName: submittedDisplayName,
            },
          }
        );
      });
    }
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
): Promise<string> => {
  const client = await clientPromise;
  try {
    const db = client.db("pts");
    const collection = db.collection(competition + season);

    const predictionFreezeDateDoc = await collection.findOne({
      _id: new ObjectId(predictionFreezeDateObjId),
    });

    const predictionFreezeDate = predictionFreezeDateDoc?.predictionFreezeDate;

    if (predictionFreezeDate === undefined)
      throw new Error(
        `Failed to update user prediction data for ${competition + season}`
      );

    if (predictionFreezeDate.getTime() < new Date().getTime()) {
      return `The competition has started and predictions are frozen`;
    } else {
      const olduserPredictionDoc = await collection.findOne({ userId: userId });
      const prevTimesPredictionsUpdated =
        olduserPredictionDoc?.timesPredictionsUpdated;

      /**@todo Get via _id if it exists on the user's predictionsMadeFor */
      const filter = { userId: userId };
      const update = {
        $set: {
          displayName: displayName,
          lastSubmissionTime: new Date(),
          predictions: entrantArrs,
          timesPredictionsUpdated: prevTimesPredictionsUpdated
            ? prevTimesPredictionsUpdated + 1
            : 1,
          type: "userData",
          userId: userId,
          userType: "standard",
        },
      };

      const result = await collection.findOneAndUpdate(filter, update, {
        returnDocument: "after",
        upsert: true,
      });

      if (!result)
        throw new Error(
          `Failed to update user prediction data for ${competition + season}`
        );

      addPredictionToUserDataQuery(
        competition,
        result._id.toString(),
        season,
        userId
      );

      return result._id.toString();
    }
  } catch (error) {
    throw error;
  }
};

/**Adds the latest competition/season the user has made predictions for to their user data */
export const addPredictionToUserDataQuery = async (
  competition: ShortHandCompStr,
  userGameDataId: string,
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
          [`predictionsMadeFor.${competition}`]: {
            season: seasonStr,
            _id: userGameDataId,
          }, // Add seasonStr & predictionId to competition set
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

  const operations = userArr.map((user) => {
    /**Standard users only need a couple of properties updated as the rest is already in the DB
     * Special users need more data to be added */
    const propertiesToUpdate: {
      controversyPercentile: { [entrantType: string]: number };
      predictionsFromAvg: { [entrantType: string]: number };
      season: { [entrantType: string]: RoundPerformance[] };
      userId?: string;
      information?: string;
      type?: "userData";
      displayName?: string;
      predictions?: { [entrantType: string]: EntrantId[] };
      timesPredictionsUpdated?: number;
      roundsTop?: { [entrantType: string]: number[] };
      userType?: "standard" | "special";
    } =
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
          };

    if (user.roundsTop) propertiesToUpdate.roundsTop = user.roundsTop;
    return {
      updateOne: {
        filter: { _id: new ObjectId(user._id) },
        update: {
          $set: propertiesToUpdate,
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
        _id: new ObjectId(lastUpdatedDateObjId),
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
        _id: new ObjectId(predictionFreezeDateObjId),
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

/**Add/Update a noOfPredictions document in the DB
 * This is used to update the noOfPredictions where the statsData isn't included
 */
export const updateNoOfPredictionsQuery = async (
  collection: Collection,
  noOfPredictions: NoOfPredictions
) => {
  try {
    const result = await collection.updateOne(
      {
        _id: new ObjectId(noOfPredictionsObjId),
      },
      {
        $set: {
          type: "noOfPredictions",
          noOfPredictions: noOfPredictions,
        },
      },
      { upsert: true }
    );

    if (!result)
      throw new Error(
        `Failed to update/add noOfPredictions document in ${collection.collectionName}`
      );
  } catch (error) {
    throw error;
  }
};

export const anonymiseUserGameDataQuery = async (
  collectionStr: string,
  _id: string
) => {
  const client = await clientPromise;
  try {
    const db = client.db("pts");
    const collection = db.collection(collectionStr);
    const result = await collection.updateOne(
      { _id: new Object(_id) },
      { $set: { displayName: "[DELETED]" } }
    );

    if (!result || result.matchedCount !== 1)
      throw new Error(
        `Couldn't anonymise user's game data in ${collection.collectionName}`
      );
  } catch (error) {
    throw error;
  }
};

/**Deletes user from either the accounts or users collection */
export const deleteAccountQuery = async (
  collectionStr: string,
  userId: string
) => {
  const client = await clientPromise;
  try {
    const db = client.db("pts");
    const collection = db.collection(collectionStr);
    const result = await collection.deleteOne(
      collectionStr === "users"
        ? { _id: new ObjectId(userId) }
        : { userId: new ObjectId(userId) }
    );

    if (!result || result.deletedCount !== 1)
      throw new Error(`Couldn't delete user from ${collectionStr}`);
  } catch (error) {
    throw error;
  }
};
