import type { Entrant } from "@custom-types/game-types";

import styles from "@styles/prediction-table.module.scss";

interface Props {
  selectedRound: number;
  standingsArr: Entrant[];
}

export const StandingsTable = ({ selectedRound, standingsArr }: Props) => {
  return (
    <div className={styles.prediction_table}>
      <p>Standings</p>
      <table>
        <thead>
          <tr>
            <th colSpan={2}>Order</th>
            <th>Entrant</th>
          </tr>
        </thead>
        <tbody>
          {standingsArr.map((entrant, index) => (
            <tr key={entrant.id} className={styles.table_row}>
              <td>{index + 1}</td>
              <td>
                <span
                  className={`${styles.flair}`}
                  style={{ backgroundColor: entrant.color }}></span>
              </td>
              <td>{entrant.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
