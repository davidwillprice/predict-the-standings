import { Button } from "@components/button/button";
import Icon from "@ui/svgs/icons/sq-icon";

import styles from "@components/game/leaderboard.module.scss";
import predictStyles from "@components/prediction-table/prediction-table.module.scss";

import { Round, UserGameDataMap } from "@custom-types/game-types";

interface Props {
  changePageHandler: Function;
  changeSelectedUserHandler: Function;
  currentUserId: string | null;
  currentUserDisplayName: string | null;
  entrantType: string;
  isSeasonOver: boolean;
  lastUpdated: Date | string;
  noOfPredictions: number;
  page: number;
  rounds: Round[];
  roundIndex: number;
  users: UserGameDataMap;
  usersPerPage: number;
}

export const Leaderboard = ({
  changePageHandler,
  changeSelectedUserHandler,
  currentUserId,
  currentUserDisplayName,
  entrantType,
  isSeasonOver,
  lastUpdated,
  noOfPredictions,
  page,
  rounds,
  roundIndex,
  users,
  usersPerPage,
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

  const noOfPages = Math.ceil(noOfPredictions / usersPerPage);

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
                className={`${predictStyles.table_row} ${styles.table_row} ${
                  row.userId === currentUserId && styles.table_row__currentUser
                }`}
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
      <div className={styles.page_nav}>
        {/**Don't show the upwards buttons if the person in first is currently showing */}
        <div className={styles.button_con}>
          {leaderboardArr[0].season[entrantType][roundIndex].leaderboardPos !==
            1 && (
            <>
              <Button
                className={styles.skip}
                aria-label="Go to the first page"
                onClick={() => {
                  changePageHandler(1);
                }}>
                <Icon type="start" strokeWidth={2} />
              </Button>
              <Button
                aria-label="Go up a page"
                onClick={() => {
                  changePageHandler(page - 1);
                }}>
                <Icon type="chevronLeft" strokeWidth={2} />
                <span>Next</span>
              </Button>
            </>
          )}
        </div>
        <p>
          {/**@todo Add a number input to allow the user to jump to any page quickly */}
          Page {page > noOfPages ? noOfPages : page} of {noOfPages}
        </p>
        {/**Don't show the previous button if the person in last is currently showing */}
        <div className={styles.button_con}>
          {leaderboardArr[leaderboardArr.length - 1].season[entrantType][
            roundIndex
          ].leaderboardPos !== noOfPredictions && (
            <>
              <Button
                aria-label="Go down a page"
                onClick={() => {
                  changePageHandler(page + 1);
                }}>
                <span>Previous</span>
                <Icon type="chevronRight" strokeWidth={2} />
              </Button>
              <Button
                className={styles.skip}
                aria-label="Go to the last page"
                onClick={() => {
                  changePageHandler(
                    Math.ceil(noOfPredictions / Object.values(users).length)
                  );
                }}>
                <Icon type="end" strokeWidth={2} />
              </Button>
            </>
          )}
        </div>
      </div>
      <div className={styles.small_print}>
        <p>
          <small>
            {`Showing ${
              leaderboardArr[0].season[entrantType][roundIndex].leaderboardPos
            } - ${
              leaderboardArr[leaderboardArr.length - 1].season[entrantType][
                roundIndex
              ].leaderboardPos
            } of ${noOfPredictions} players`}
          </small>
        </p>
        {lastUpdated && (
          <p>
            <small>Last updated: {lastUpdated.toLocaleString()}</small>
          </p>
        )}
      </div>
    </div>
  );
};
