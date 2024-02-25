import { PreseasonLeaderboard } from "@components/game/pre-season-leaderboard";
import { PreSeasonPredictionTable } from "@components/prediction-table/pre-season-prediction-table";

import styles from "@components/game/game-container.module.scss";

export const PreSeasonContainer = () => {
  return (
    <div className={styles.con}>
      <PreseasonLeaderboard />
      <PreSeasonPredictionTable />
    </div>
  );
};
