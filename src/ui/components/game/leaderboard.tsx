import styles from "@components/game/leaderboard.module.scss";
import predictStyles from "@components/prediction-table/prediction-table.module.scss";

import { Round, UserGameDataMap } from "@custom-types/game-types";
import Icon from "@ui/svgs/icons/sq-icon";

interface Props {
  changeSelectedUserHandler: Function;
  currentUserId: string | null;
  currentUserDisplayName: string | null;
  entrantType: string;
  isSeasonOver: boolean;
  lastUpdated: Date | string;
  rounds: Round[];
  roundIndex: number;
  users: UserGameDataMap;
}

export const Leaderboard = ({
  changeSelectedUserHandler,
  currentUserId,
  currentUserDisplayName,
  entrantType,
  isSeasonOver,
  lastUpdated,
  rounds,
  roundIndex,
  users,
}: Props) => {
  //**Sort the users object into an array ordered by their leaderboard positions */
  const leaderboardArr = [];
  for (const user of Object.values(users)) {
    leaderboardArr.push(user);
  }
  leaderboardArr.sort(
    (a, b) =>
      a.season[entrantType][roundIndex].leaderboardPos -
      b.season[entrantType][roundIndex].leaderboardPos
  );

  if (typeof lastUpdated === "string") lastUpdated = new Date(lastUpdated);

  return (
    <div className={predictStyles.prediction_table}>
      <table className={styles.leaderboard}>
        <thead>
          <tr>
            <th className={styles.position}>Pos</th>
            {rounds.length === 1 && isSeasonOver ? (
              ""
            ) : (
              <th aria-label="Position change header"></th>
            )}
            <th>Name</th>
            <th>Accuracy</th>
            <th className={styles.perfect_positions}>
              Perfect <br />
              Predictions
            </th>
          </tr>
        </thead>
        <tbody>
          {leaderboardArr.map((row, index) => {
            const roundData = row.season[entrantType][roundIndex];
            return (
              <tr
                key={row.id}
                className={`${predictStyles.table_row} ${styles.table_row}`}
                onClick={() => changeSelectedUserHandler(row.userId)}>
                <td className={styles.position}>
                  {isSeasonOver &&
                  index === 0 &&
                  roundIndex === rounds.length - 1 ? (
                    <Icon type="trophy" strokeWidth={1} />
                  ) : (
                    roundData.leaderboardPos
                  )}
                </td>
                {rounds.length === 1 && isSeasonOver ? (
                  ""
                ) : (
                  <td
                    className={`${styles.position_diff} ${
                      roundData.prevLeaderboardPosDiff > 0
                        ? styles.pos_change
                        : roundData.prevLeaderboardPosDiff < 0
                        ? styles.neg_change
                        : styles.no_change
                    }`}>
                    <i />
                  </td>
                )}
                <td className={styles.name_cell}>
                  {row.userId === currentUserId
                    ? currentUserDisplayName
                    : row.displayName}{" "}
                  {row.userType === "special" && (
                    <Icon type="star" strokeWidth={1} />
                  )}
                  {/**@todo Add which entrants are causing them the biggest issues? */}
                </td>
                <td
                  className={
                    styles.accuracy
                  }>{`${roundData.percentCorrect}%`}</td>
                <td className={styles.perfect_positions}>
                  {roundData.diffCounts[0]}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {lastUpdated && (
        <p>
          <small>Last updated: {lastUpdated.toLocaleString()}</small>
        </p>
      )}
    </div>
  );
};
