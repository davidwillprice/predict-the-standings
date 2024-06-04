import { seasonData20232024 } from "./2023-2024";
import { seasonData20242025 } from "./2024-2025";
import type { AllLocalSeasonData } from "@custom-types/game-types";

export const allPlSeasonData: AllLocalSeasonData = [
  seasonData20242025,
  seasonData20232024,
].map((seasonData) => {
  return {
    ...seasonData,
    competitionStrs: {
      display: "Premier League",
      hyphenated: "premier-league",
      shortHand: "pl",
    },
  };
});
