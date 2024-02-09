import { unstable_cache } from "next/cache";

import { getAllPredictionTablesQuery } from "./db-functions";

import { Sport } from "@custom-types/misc";

export const getAllPredictonData = async (season: string, sport: Sport) => {
  const predictonDataRes = await getAllPredictionTablesQuery(season, sport);
  return predictonDataRes;
};
