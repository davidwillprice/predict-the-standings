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
  await query(`UPDATE users
    SET ${sport}_${season} = ARRAY[${entrantArr.map(
    (entrant) => `'${entrant.sName}'`
  )}]
    WHERE id = ${userId}`);
};

export const getPredictionTable = async (
  season: string,
  sport: Sport,
  userId: number
) => {
  const res = await query(`SELECT ${sport}_${season}
  FROM users
  WHERE id = ${userId}`);
  return res.rows[0][`${sport}_${season}`];
};
