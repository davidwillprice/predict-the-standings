import { seasonData2024 } from "./2024";
import type { AllLocalSeasonData } from "@custom-types/game-types";

export const allEurovisionSeasonData: AllLocalSeasonData = [seasonData2024].map(
  (seasonData) => {
    return {
      ...seasonData,
      competitionStrs: {
        display: "Eurovision",
        hyphenated: "eurovision",
        shortHand: "eurovision",
      },
    };
  }
);
