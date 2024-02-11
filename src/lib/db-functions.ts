"use server";
import { query } from "@lib/db";

import { Entrant } from "@custom-types/game-types";
import { Sport } from "@custom-types/misc";

export const submitPredictions = async (
  entrantArr: Entrant[],
  season: string,
  sport: Sport,
  userId: number
) => {
  await query(`INSERT INTO ${sport}_${season} (prediction_id, user_id, predictions)
  VALUES (${userId}, ${userId}, ARRAY[${entrantArr.map(
    (entrant) => `'${entrant.sName}'`
  )}])
  ON CONFLICT (prediction_id)
  DO UPDATE
  SET user_id = ${userId}, predictions = ARRAY[${entrantArr.map(
    (entrant) => `'${entrant.sName}'`
  )}]`);
};

export const getPredictionTable = async (
  season: string,
  sport: Sport,
  userId: number
) => {
  const res = await query(`SELECT predictions
  FROM ${sport}_${season}
  WHERE prediction_id = ${userId}`);
  try {
    return res.rows[0]["predictions"];
  } catch (_) {
    return;
  }
};

export const getAllPredictionTablesQuery = async (
  season: string,
  sport: Sport
) => {
  const res = await query(`SELECT 
  users.id, 
  users.display_name, 
  ${sport}_${season}.predictions
  FROM 
  users INNER JOIN ${sport}_${season} ON ${sport}_${season}.user_id = users.id 
  ORDER BY users.id;`);
  console.log(`Running DB query at ${new Date().toISOString()}`);
  return res.rows;
};

export const submitDisplayNameQuery = async (
  submittedDisplayName: string,
  userId: number
) => {
  const res = await query(`UPDATE users
  SET display_name = '${submittedDisplayName}'
  WHERE id = ${userId}
    AND NOT EXISTS (
      SELECT ${userId}
      FROM users
      WHERE display_name = '${submittedDisplayName}'
        AND id <> ${userId}
    ) RETURNING *;
    ;`);
  return res.rows;
};
