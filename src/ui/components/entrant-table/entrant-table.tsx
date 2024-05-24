import { EntrantRow } from "@components/entrant-table/entrant-row";

import styles from "@components/entrant-table/entrant-table.module.scss";

import { Entrant, ShortHandCompStr } from "@custom-types/game-types";

interface Props {
  entrantArr: Entrant[];
  shortHandCompStr: ShortHandCompStr;
  accuracy?: number;
  heading?: string;
  isFullWidth?: boolean;
  isTwoColumns?: boolean;
  posDiffArr?: number[];
}

export const EntrantTable = ({
  entrantArr,
  shortHandCompStr,
  accuracy,
  heading,
  isFullWidth,
  isTwoColumns,
  posDiffArr,
}: Props) => (
  <div className={styles.con}>
    {heading && <h4 className={styles.heading}>{heading}</h4>}
    <table
      className={`${styles.table} ${isFullWidth ? styles.full_width : ""} ${
        isTwoColumns ? styles.single_entrant_type_table : ""
      }`}>
      <tbody
        style={
          isTwoColumns
            ? {
                gridTemplateRows: `repeat(${Math.ceil(
                  entrantArr.length / 2
                )}, auto)`,
              }
            : undefined
        }>
        {entrantArr.map((entrant, index) => (
          <EntrantRow
            key={entrant.sName}
            entrant={entrant}
            index={index}
            posDiff={posDiffArr ? posDiffArr[index] : undefined}
            shortHandCompStr={shortHandCompStr}
          />
        ))}
      </tbody>
    </table>
    {accuracy && <p className={styles.accuracy}>Accuracy: {accuracy}%</p>}
  </div>
);
