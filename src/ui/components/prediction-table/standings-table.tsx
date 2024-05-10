import type { Competition, Entrants } from "@custom-types/game-types";

import { FlagCell } from "@components/prediction-table/eurovision-flag-cell";

import styles from "@components/prediction-table/prediction-table.module.scss";

interface Props {
  className: string;
  competition?: Competition;
  entrants: Entrants;
  standingsArr: string[];
}

export const StandingsTable = ({
  entrants,
  className,
  competition,
  standingsArr,
}: Props) => {
  const entrantArr = standingsArr.map((entrant) => entrants[entrant]);
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
          {entrantArr.map((entrant, index) => (
            <tr key={entrant.sName} className={styles.table_row}>
              <td className={styles.position_cell}>{index + 1}</td>
              {competition === "eurovision" ? (
                <FlagCell name={entrant.name} sName={entrant.sName} />
              ) : (
                <td className={styles.flair_cell}>
                  <span
                    className={`${styles.flair}`}
                    style={{ backgroundColor: entrant.color }}></span>
                </td>
              )}
              <td className={styles.name_cell}>
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
