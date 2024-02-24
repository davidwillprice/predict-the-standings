"use server";
import { query } from "@lib/db";

import { Entrant } from "@custom-types/game-types";
import { Sport } from "@custom-types/misc";

export const submitPredictionsQuery = async (
  driverArr: Entrant[],
  season: string,
  sport: Sport,
  teamArr: Entrant[],
  userId: number
) => {
  await query(`INSERT INTO ${sport}_${season} (prediction_id, user_id, driver_predictions, team_predictions)
  VALUES (${userId}, ${userId}, ARRAY[${driverArr.map(
    (entrant) => `'${entrant.sName}'`
  )}], ARRAY[${teamArr.map((entrant) => `'${entrant.sName}'`)}])
  ON CONFLICT (prediction_id)
  DO UPDATE
  SET user_id = ${userId}, driver_predictions = ARRAY[${driverArr.map(
    (entrant) => `'${entrant.sName}'`
  )}], team_predictions = ARRAY[${teamArr.map(
    (entrant) => `'${entrant.sName}'`
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

export const getAllF1PredictionTablesQuery = async (
  season: string,
  sport: Sport
) => {
  console.log(`Running DB query at ${new Date().toISOString()}`);
  return await query(`SELECT
  users.id, 
  users.display_name, 
  ${sport}_${season}.driver_predictions,
  ${sport}_${season}.team_predictions
  FROM 
  users INNER JOIN ${sport}_${season} ON ${sport}_${season}.user_id = users.id 
  ORDER BY users.id;`);
};

export const submitDisplayNameQuery = async (
  submittedDisplayName: string,
  userId: number
) => {
  const res = await query(`UPDATE users
  SET display_name = '${submittedDisplayName}',
  last_display_name_submission = ${new Date().getTime()}
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
