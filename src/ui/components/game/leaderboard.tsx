import styles from "@components/game/leaderboard.module.scss";
import predictStyles from "@components/prediction-table/prediction-table.module.scss";

import { Round } from "@custom-types/game-types";
import Icon from "@ui/svgs/icons/sq-icon";

interface Props {
  currentUserId: string | null;
  currentUserDisplayName: string | null;
  entrantType: string;
  lastUpdated: Date | string;
  rounds: Round[];
  roundIndex: number;
  changeSelectedUserHandler: Function;
}

export const Leaderboard = ({
  changeSelectedUserHandler,
  currentUserId,
  currentUserDisplayName,
  entrantType,
  lastUpdated,
  rounds,
  roundIndex,
}: Props) => {
  if (typeof lastUpdated === "string") lastUpdated = new Date(lastUpdated);
  return (
    <div className={predictStyles.prediction_table}>
      <table className={styles.leaderboard}>
        <thead>
          <tr>
            <th className={styles.position}>Pos</th>
            <th aria-label="Position change header"></th>
            <th>Name</th>
            <th>Accuracy</th>
            <th className={styles.perfect_positions}>Perfect Predictions</th>
          </tr>
        </thead>
        <tbody>
          {rounds[roundIndex].leaderboards[entrantType].map((row, index) => (
            <tr
              key={row.user.displayName}
              className={`${predictStyles.table_row} ${styles.table_row}`}
              onClick={() => changeSelectedUserHandler(row.user.id)}>
              <td className={styles.position}>{index + 1}</td>
              <td
                className={`${styles.position_diff} ${
                  row.prevRdDiff > 0
                    ? styles.pos_change
                    : row.prevRdDiff < 0
                    ? styles.neg_change
                    : styles.no_change
                }`}>
                <i />
              </td>
              <td className={styles.name_cell}>
                {row.user.id === currentUserId
                  ? currentUserDisplayName
                  : row.user.displayName}{" "}
                {row.user.information && <Icon type="star" strokeWidth={1} />}
                {/**@todo Add which entrants are causing them the biggest issues? */}
              </td>
              <td>{`${row.percentCorrect}%`}</td>
              <td className={styles.perfect_positions}>
                {row.user.season[entrantType][roundIndex].diffCounts[0]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {lastUpdated ? (
        <p>
          <small>Last updated: {lastUpdated.toLocaleString()}</small>
        </p>
      ) : (
        ""
      )}
    </div>
  );
};
