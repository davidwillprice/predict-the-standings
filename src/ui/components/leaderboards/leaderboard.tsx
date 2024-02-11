import styles from "@components/leaderboards/leaderboard.module.scss";
import predictStyles from "@styles/prediction-table.module.scss";

import { Round } from "@custom-types/game-types";

interface Props {
  rounds: Round[];
  roundIndex: number;
}

export const Leaderboard = ({ rounds, roundIndex }: Props) => {
  return (
    <div className={predictStyles.prediction_table}>
      <table className={styles.leaderboard}>
        <thead>
          <tr>
            <th className={styles.position}>Pos</th>
            <th aria-label="Position change header"></th>
            <th>Name</th>
            <th>Accuracy</th>
            <th>Perfect Predictions</th>
          </tr>
        </thead>
        <tbody>
          {rounds[roundIndex].leaderboards.map((row, index) => (
            <tr
              key={row.user.displayName}
              className={predictStyles.prediction_table_row}>
              <td className={styles.position}>{index + 1}</td>
              <td
                className={`${styles.positionDiff} ${
                  row.prevRdDiff > 0
                    ? styles.posChange
                    : row.prevRdDiff < 0
                    ? styles.negChange
                    : styles.noChange
                }`}>
                <i></i>
              </td>
              <td>{row.user.displayName}</td>
              <td>{`${row.percentCorrect}%`}</td>
              <td>{row.user.season[roundIndex].diffCounts[0]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
