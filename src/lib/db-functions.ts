"use server";
import { query } from "@lib/db";

import { F1DriverEntrant } from "@custom-types/entrants";

export const submitPredictions = async (entrantArr: F1DriverEntrant[]) => {
  await query(`UPDATE users
    SET f1_2024 = ARRAY[${entrantArr.map((entrant) => `'${entrant.sName}'`)}]
    WHERE id = 1`);
};
