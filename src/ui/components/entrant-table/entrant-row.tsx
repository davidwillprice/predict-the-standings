import { FlagCell } from "@components/prediction-table/eurovision-flag-cell";
import Icon from "@ui/svgs/icons/sq-icon";

import { Entrant, ShortHandCompStr } from "@custom-types/game-types";

import styles from "@components/entrant-table/entrant-table.module.scss";

interface Props {
  draggable?: boolean;
  entrant: Entrant;
  /**The index can be null if the entrant row is being dragged during prediction submission */
  index: number | null;
  posDiff?: number;
  shortHandCompStr: ShortHandCompStr;
}

export const EntrantRow = ({
  draggable,
  entrant,
  index,
  posDiff,
  shortHandCompStr,
}: Props) => {
  const standardRowContent = (
    <>
      <td className={styles.position_cell}>
        {index !== null ? index + 1 : "  "}
      </td>
      {shortHandCompStr === "eurovision" ? (
        <FlagCell name={entrant.name} sName={entrant.sName} />
      ) : (
        <td className={styles.flair_cell}>
          <span
            className={`${styles.flair}`}
            style={{ backgroundColor: entrant.color }}></span>
        </td>
      )}
      <td
        className={`${styles.name_cell} ${
          entrant.name.length > 11 && styles.large_name
        }`}>
        <span className={styles.name}>{entrant.name}</span>
        <span className={styles.sName}>{entrant.sName}</span>
      </td>
      {posDiff !== undefined && (
        <td
          className={`${styles.pos_diff_cell} ${
            posDiff > 0 ? styles.up : posDiff < 0 ? styles.down : styles.perfect
          }`}>
          {posDiff === 0 ? (
            <Icon type={"success"} strokeWidth={2} />
          ) : (
            <>
              <i></i>
              <span>{Math.abs(posDiff)}</span>
            </>
          )}
        </td>
      )}
    </>
  );

  /**If being used as part of the predictions editting, don't return the <tr> so that the <tr> and all its listeners/references can be set further up the chain */
  if (draggable) {
    return (
      <>
        <td className={styles.drag_cell}>≡</td>
        {standardRowContent}
      </>
    );
  } else {
    return <tr className={styles.table_row}>{standardRowContent}</tr>;
  }
};
