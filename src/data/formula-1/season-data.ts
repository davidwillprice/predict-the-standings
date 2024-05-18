import { seasonData2024 } from "./2024";
import { seasonData2023 } from "./2023";
import type { AllLocalSeasonData } from "@custom-types/game-types";

export const allF1SeasonData: AllLocalSeasonData = [
  seasonData2024,
  seasonData2023,
].map((seasonData) => {
  return {
    ...seasonData,
    competitionStrs: {
      display: "Formula 1",
      hyphenated: "formula-1",
      shortHand: "f1",
    },
  };
});
