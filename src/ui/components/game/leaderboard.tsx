import { Button } from "@components/button/button";
import Icon from "@ui/svgs/icons/sq-icon";

import styles from "@components/game/leaderboard.module.scss";
import predictStyles from "@components/prediction-table/prediction-table.module.scss";

import { Round, UserGameData, UserGameDataMap } from "@custom-types/game-types";

interface Props {
  changePageHandler: Function;
  changeSelectedUserHandler: Function;
  currUserGameData: UserGameData | null;
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
  currUserGameData,
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

  const worstDisplayedLeaderboardPos =
    leaderboardArr[leaderboardArr.length - 1].season[entrantType][roundIndex]
      .leaderboardPos;
  const bestDisplayedLeaderboardPos =
    leaderboardArr[0].season[entrantType][roundIndex].leaderboardPos;

  const leaderboardRow = (userGameData: UserGameData) => {
    const roundData = userGameData.season[entrantType][roundIndex];
    return (
      <tr
        className={`${predictStyles.table_row} ${styles.table_row} ${
          userGameData.userId === currUserGameData?.userId &&
          styles.table_row__currentUser
        }`}
        onClick={() => changeSelectedUserHandler(userGameData)}>
        <td className={styles.position}>
          {isSeasonOver &&
          roundData.leaderboardPos === 1 &&
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
          {userGameData.userId === currUserGameData?.userId
            ? currUserGameData?.displayName
            : userGameData.displayName}{" "}
          {userGameData.userType === "special" && (
            <Icon type="star" strokeWidth={1} />
          )}
        </td>
        <td className={styles.accuracy}>{`${roundData.percentCorrect}%`}</td>
        <td className={styles.perfect_positions}>{roundData.diffCounts[0]}</td>
      </tr>
    );
  };

  const lineRow = (
    <tr className={styles.line_row} aria-hidden="true">
      <td colSpan={5}>
        <hr />
      </td>
    </tr>
  );

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
          {/**If the current user is position above players showing on the current page, show a preview of their position above the other players */}
          {currUserGameData &&
            currUserGameData.season[entrantType][roundIndex].leaderboardPos <
              bestDisplayedLeaderboardPos && (
              <>
                {leaderboardRow(currUserGameData)}
                {lineRow}
              </>
            )}
          {/**Loop over and display the leaderboard rows for the currrent page */}
          {leaderboardArr.map((userGameData) => {
            return leaderboardRow(userGameData);
          })}
          {/**If the current user is position below players showing on the current page, show a preview of their position below the other players */}
          {currUserGameData &&
            currUserGameData.season[entrantType][roundIndex].leaderboardPos >
              worstDisplayedLeaderboardPos && (
              <>
                {lineRow}
                {leaderboardRow(currUserGameData)}
              </>
            )}
        </tbody>
      </table>
      {noOfPages > 1 && (
        <div className={styles.page_nav}>
          {/**Don't show the upwards buttons if the person first in the leaderboard is currently showing */}
          <div className={styles.button_con}>
            {bestDisplayedLeaderboardPos !== 1 && (
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
          {/**Don't show the previous button if the person last in the leaderboard is currently showing */}
          <div className={styles.button_con}>
            {worstDisplayedLeaderboardPos !== noOfPredictions && (
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
      )}
      <div className={styles.small_print}>
        <p>
          <small>
            {`Showing ${bestDisplayedLeaderboardPos} - ${worstDisplayedLeaderboardPos} of ${noOfPredictions} players`}
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
