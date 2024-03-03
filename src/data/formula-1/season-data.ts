import { seasonData2024 } from "./2024";
import { seasonData2023 } from "./2023";
import type { Entrant, Round } from "@custom-types/game-types";

interface AllSeasonData {
  [key: string]: {
    drivers: { [key: string]: Entrant };
    isSeasonOver: boolean;
    predictionFreezeTime: Date;
    rounds: Round[];
    teams: { [key: string]: Entrant };
  };
}

export const allSeasonData: AllSeasonData = {
  "2023": seasonData2023,
  "2024": seasonData2024,
};
