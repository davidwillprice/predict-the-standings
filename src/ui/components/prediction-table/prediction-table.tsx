import type { Leaderboard } from "@custom-types/game-types";

import styles from "@components/prediction-table/prediction-table.module.scss";

interface Props {
  selectedRound: number;
  userLeaderboard: Leaderboard;
}

export const PredictionTable = ({ selectedRound, userLeaderboard }: Props) => {
  const { percentCorrect, user } = userLeaderboard;
  const tableData = user.season[selectedRound].diffs;
  return (
    <div className={styles.prediction_table}>
      <h4 className={styles.heading}>{user.displayName} Predictions</h4>
      <table>
        <thead>
          <tr>
            <th colSpan={2}>
              {/**@todo Re-add <th> text when I figure out a good way of doing it 
              Order*/}
            </th>
            <th>
              {/**@todo Re-add <th> text when I figure out a good way of doing it 
              Entrant*/}
            </th>
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
      <p className={styles.heading}>Accuracy: {+percentCorrect}%</p>
    </div>
  );
};
