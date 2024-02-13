import type { Entrant } from "@custom-types/game-types";

import styles from "@components/prediction-table/prediction-table.module.scss";

interface Props {
  selectedRound: number;
  standingsArr: Entrant[];
  className: string;
}

export const StandingsTable = ({
  className,
  selectedRound,
  standingsArr,
}: Props) => {
  return (
    <div className={`${styles.prediction_table} ${className}`}>
      <h4 className={styles.heading}>Actual Standings</h4>
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
          {standingsArr.map((entrant, index) => (
            <tr key={entrant.id} className={styles.table_row}>
              <td>{index + 1}</td>
              <td>
                <span
                  className={`${styles.flair}`}
                  style={{ backgroundColor: entrant.color }}></span>
              </td>
              <td>
                <span className={styles.name}>{entrant.name}</span>
                <span className={styles.sName}>{entrant.sName}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
