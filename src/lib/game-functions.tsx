import { cache } from "react";

import { getAllPredictionTablesQuery } from "./db-functions";

import { Sport } from "@custom-types/misc";

export const getAllPredictonData = cache(
  async (season: string, sport: Sport) => {
    try {
      return await getAllPredictionTablesQuery(season, sport);
      //return new Date();
    } catch (_) {
      console.log("Error");
    }
  }
);
