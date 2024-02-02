"use server";
import { query } from "@lib/db";

export const submitPredictions = async (order: string | undefined) => {
  await query(`UPDATE users
    SET f1_2024 = ARRAY[${order}]
    WHERE id = 1`);
};
