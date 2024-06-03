"use client";
import { useRouter } from "next/navigation";

import { getLengthOfLongestConsecutiveNumbers } from "@lib/misc";

import { Panel } from "@components/panels/panel";

import {
  CompetitionStrings,
  LeaderboardToppingGameDataIdMap,
  UserGameData,
  GameDataMap,
} from "@custom-types/game-types";

import styles from "./player-stats.module.scss";
import leaderboardStyles from "@components/game/leaderboard.module.scss";
import entrantTableStyles from "@components/entrant-table/entrant-table.module.scss";

type Props = {
  competitionStrs: CompetitionStrings;
  currUserId: string | undefined;
  isSeasonOver: boolean;
  leaderboardToppingGameDataIdMap: LeaderboardToppingGameDataIdMap;
  seasonStr: string;
  gameDataMap: GameDataMap;
};

export const LeaderboardToppers = ({
  competitionStrs,
  currUserId,
  isSeasonOver,
  leaderboardToppingGameDataIdMap,
  seasonStr,
  gameDataMap,
}: Props) => {
  const router = useRouter();
  const leaderboardToppingData: {
    [entrantType: string]: {
      user: UserGameData;
      roundsTop: number[];
    }[];
  } = {};
  for (const entrantType of Object.keys(leaderboardToppingGameDataIdMap)) {
    leaderboardToppingData[entrantType] = [];
    leaderboardToppingGameDataIdMap[entrantType].forEach((user) => {
      leaderboardToppingData[entrantType].push({
        user: gameDataMap[user._id],
        roundsTop: user.roundsTop,
      });
    });
  }
  const entrantTypes = Object.keys(leaderboardToppingData);

  const handleRowClick = (entrantType: string, userId: string) => {
    let entrantTypeStr =
      competitionStrs.shortHand === "f1" && entrantType === "teams"
        ? "constructors"
        : entrantType;
    router.push(
      `/${competitionStrs.hyphenated}/${seasonStr}/?user=${userId}&leaderboard=${entrantTypeStr}`
    );
  };
  return (
    <Panel>
      <div className={styles.leaderboard_toppers__con}>
        <h2>Chart Toppers</h2>
        <p>
          Number of{" "}
          {competitionStrs.shortHand === "pl" ? "gameweeks" : "rounds"} that
          users {isSeasonOver ? "" : "have"} spent top of the leaderboard.
        </p>
        <hr />
        <div className={styles.leaderboard_toppers__tables}>
          {Object.values(leaderboardToppingData).map(
            (tableData, tableIndex) => (
              <div
                key={tableIndex}
                className={styles.leaderboard_toppers__table_con}>
                {entrantTypes.length > 1 && (
                  <h3>
                    {competitionStrs.shortHand === "f1" &&
                    entrantTypes[tableIndex] === "teams"
                      ? "Constructors"
                      : `${entrantTypes[
                          tableIndex
                        ][0].toUpperCase()}${entrantTypes[tableIndex].slice(
                          1
                        )}`}{" "}
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
                        No of{" "}
                        {competitionStrs.shortHand === "pl"
                          ? "Gameweeks"
                          : "Rounds"}
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
                        }`}
                        /**@todo This is wildly inaccessible and another way should be found */
                        onClick={() =>
                          handleRowClick(
                            entrantTypes[tableIndex],
                            rowData.user.userId
                          )
                        }>
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
            )
          )}
        </div>
      </div>
    </Panel>
  );
};
