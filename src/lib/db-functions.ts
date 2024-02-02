"use server";
import { query } from "@lib/db";

import { F1DriverEntrant } from "@custom-types/entrants";
import { Sport } from "@custom-types/misc";

export const submitPredictions = async (
  entrantArr: F1DriverEntrant[],
  season: string,
  sport: Sport
) => {
  await query(`UPDATE users
    SET ${sport}_${season} = ARRAY[${entrantArr.map(
    (entrant) => `'${entrant.sName}'`
  )}]
    WHERE id = 1`);
};
