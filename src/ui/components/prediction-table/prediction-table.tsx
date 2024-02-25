import type { User } from "@custom-types/game-types";
import { calcPredictionsAccuracy } from "@lib/game-functions";
import Icon from "@ui/svgs/icons/sq-icon";

import styles from "@components/prediction-table/prediction-table.module.scss";

interface Props {
  entrantType: string;
  selectedRound: number;
  selectedUser: User;
}

export const PredictionTable = ({
  entrantType,
  selectedRound,
  selectedUser,
}: Props) => {
  const tableData = selectedUser.season[entrantType][selectedRound].diffs;
  const accuracy = calcPredictionsAccuracy(
    selectedUser.predictions[entrantType].length,
    selectedUser.season[entrantType][selectedRound].diffTotal
  );
  return (
    <div className={styles.prediction_table}>
      <h4 className={styles.heading}>{selectedUser.displayName} Predictions</h4>
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
              <td className={styles.position_cell}>{index + 1}</td>
              <td>
                <span
                  className={`${styles.flair}`}
                  style={{ backgroundColor: rowData.entrant.color }}></span>
              </td>
              <td className={styles.name_cell}>
                <span className={styles.name}>{rowData.entrant.name}</span>
                <span className={styles.sName}>{rowData.entrant.sName}</span>
              </td>
              <td
                className={`${styles.pos_diff_cell} ${
                  rowData.posDiff > 0
                    ? styles.up
                    : rowData.posDiff < 0
                    ? styles.down
                    : styles.perfect
                }`}>
                {rowData.posDiff === 0 ? (
                  <Icon type={"success"} strokeWidth={2} />
                ) : (
                  <>
                    <i></i>
                    <span>{Math.abs(rowData.posDiff)}</span>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={styles.accuracy}>Accuracy: {accuracy}%</p>
    </div>
  );
};
