"use server";
import { query } from "@lib/db";

import { F1DriverEntrant } from "@custom-types/entrants";
import { Sport } from "@custom-types/misc";

export const submitPredictions = async (
  entrantArr: F1DriverEntrant[],
  season: string,
  sport: Sport,
  userId: number
) => {
  await query(`INSERT INTO ${sport}_${season} (prediction_id, user_id, prediction)
  VALUES (${userId}, ${userId}, ARRAY[${entrantArr.map(
    (entrant) => `'${entrant.sName}'`
  )}])
  ON CONFLICT (prediction_id)
  DO UPDATE
  SET user_id = ${userId}, prediction = ARRAY[${entrantArr.map(
    (entrant) => `'${entrant.sName}'`
  )}]`);
};

export const getPredictionTable = async (
  season: string,
  sport: Sport,
  userId: number
) => {
  const res = await query(`SELECT prediction
  FROM ${sport}_${season}
  WHERE prediction_id = ${userId}`);
  return res.rows[0]["prediction"];
};

export const submitDisplayName = async (submittedDisplayName: string) => {};
