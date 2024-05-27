import {
  LeaderboardToppingUserIds,
  ShortHandCompStr,
  UserGameData,
  UserGameDataMap,
} from "@custom-types/game-types";

import { getLengthOfLongestConsecutiveNumbers } from "@lib/misc";

import { Panel } from "@components/panels/panel";

import styles from "./player-stats.module.scss";
import leaderboardStyles from "@components/game/leaderboard.module.scss";
import entrantTableStyles from "@components/entrant-table/entrant-table.module.scss";

type Props = {
  currUserId: string | undefined;
  isSeasonOver: boolean;
  leaderboardToppingUserIds: LeaderboardToppingUserIds;
  shortHandCompStr: ShortHandCompStr;
  users: UserGameDataMap;
};

export const LeaderboardToppers = ({
  currUserId,
  isSeasonOver,
  leaderboardToppingUserIds,
  shortHandCompStr,
  users,
}: Props) => {
  const leaderboardToppingData: {
    [entrantType: string]: {
      user: UserGameData;
      roundsTop: number[];
    }[];
  } = {};
  for (const entrantType of Object.keys(leaderboardToppingUserIds)) {
    leaderboardToppingData[entrantType] = [];
    leaderboardToppingUserIds[entrantType].forEach((user) => {
      leaderboardToppingData[entrantType].push({
        user: users[user.userId],
        roundsTop: user.roundsTop,
      });
    });
  }
  const entrantTypes = Object.keys(leaderboardToppingData);

  return (
    <Panel>
      <div className={styles.leaderboard_toppers__con}>
        <h2>Chart Toppers</h2>
        <p>
          Number of {shortHandCompStr === "pl" ? "gameweeks" : "rounds"} that
          users {isSeasonOver ? "" : "have"} spent top of the leaderboard.
        </p>
        <hr />
        <div className={styles.leaderboard_toppers__tables}>
          {Object.values(leaderboardToppingData).map((tableData, index) => (
            <div key={index} className={styles.leaderboard_toppers__table_con}>
              {entrantTypes.length > 1 && (
                <h3>
                  {shortHandCompStr === "f1" && entrantTypes[index] === "teams"
                    ? "Constructors"
                    : `${entrantTypes[index][0].toUpperCase()}${entrantTypes[
                        index
                      ].slice(1)}`}{" "}
                  Leaderboard
                </h3>
              )}
              <table
                className={`${leaderboardStyles.leaderboard} ${entrantTableStyles.table}`}>
                <thead>
                  <tr>
                    <th className={leaderboardStyles.position}>Pos</th>
                    <th className={styles.leaderboard_toppers__name_cell}>
                      Name
                    </th>
                    <th>
                      No of {shortHandCompStr === "pl" ? "Gameweeks" : "Rounds"}
                    </th>
                    <th>Longest Streak</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((rowData, index) => (
                    <tr
                      key={rowData.user.displayName}
                      className={`${entrantTableStyles.table_row} ${
                        entrantTableStyles.table_row__tertiary_bg
                      } ${leaderboardStyles.table_row} ${
                        rowData.user.userId === currUserId
                          ? leaderboardStyles.table_row__currentUser
                          : ""
                      }`}>
                      <td className={leaderboardStyles.position}>
                        {index + 1}
                      </td>
                      <td>{rowData.user.displayName}</td>
                      <td>{rowData.roundsTop.length}</td>
                      <td>
                        {getLengthOfLongestConsecutiveNumbers(
                          rowData.roundsTop
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
};
