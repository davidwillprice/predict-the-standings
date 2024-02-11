import type { Leaderboard } from "@custom-types/game-types";

import styles from "@styles/prediction-table.module.scss";

interface Props {
  selectedRound: number;
  userLeaderboard: Leaderboard;
}

export const PredictionTable = ({ selectedRound, userLeaderboard }: Props) => {
  const { percentCorrect, user } = userLeaderboard;
  const tableData = user.season[selectedRound].diffs;
  return (
    <div id="prediction-table" className={styles.prediction_table}>
      <table>
        <thead>
          <tr>
            <th colSpan={2}>Order</th>
            <th>Entrant</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((rowData, index) => (
            <tr key={rowData.entrant.id} className={styles.table_row}>
              <td>{index + 1}</td>
              <td>
                <span
                  className={`${styles.flair}`}
                  style={{ backgroundColor: rowData.entrant.color }}></span>
              </td>
              <td>{rowData.entrant.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
