"use server";
import { query } from "@lib/db";

import { Entrant } from "@custom-types/entrants";

export const submitPredictions = async (items: Entrant[]) => {
  await query(`UPDATE users
    SET f1_2024 = ARRAY[${items.map((entrant) => `'${entrant.sName}'`)}]
    WHERE id = 1`);
};
