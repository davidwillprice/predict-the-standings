"use client";

import { useEffect, useState } from "react";
import { getUserGameDataQuery } from "@lib/db-functions";

import { allF1SeasonData } from "@data/formula-1/season-data";
import { allEurovisionSeasonData } from "@data/eurovision/season-data";
import { allPlSeasonData } from "@data/premier-league/season-data";
import {
  calcRemainingRoundPerformanceData,
  calcUserGameDataMapPerformance,
} from "@lib/game-data";

import Link from "next/link";
import { PanelHeading } from "@components/panels/panel-heading";
import Icon from "@ui/svgs/icons/sq-icon";
import {
  getCollectionObjFromPredictionsMadeFor,
  numberToOrdinalNumber,
  toTitleCase,
} from "@lib/misc";
import { Panel } from "@components/panels/panel";

import { User } from "next-auth";
import { CollectionObj, CompetitionStrings } from "@custom-types/game-types";

import styles from "@styles/competitions.module.scss";
import btnConstyles from "@components/button/button-containers.module.scss";
import skeleStyles from "@components/profile/competitions-skeleton.module.scss";
import btnStyles from "@components/button/button.module.scss";

interface Props {
  user: User;
}

interface PerformanceRow {
  accurracy: number | undefined;
  competitionStrs: CompetitionStrings;
  entrantType: string;
  leaderboardPos: number | undefined;
  seasonStatus: string;
  seasonStr: string;
}
/**@todo Add pagination */
export const PerformanceOverview = ({ user }: Props) => {
  const [performanceRowArr, setPerformanceRowArr] = useState<
    PerformanceRow[] | null
  >(null);

  useEffect(() => {
    /**Get the userPredictionData for every comp/season the user has predicted for */
    const getAllGameDataForUser = (
      gameDataCollectionObjArr: CollectionObj[]
    ) => {
      return new Promise((_, reject) => {
        Promise.all(
          gameDataCollectionObjArr.map((collectionObj) =>
            getUserGameDataQuery(
              collectionObj.collectionName,
              "",
              collectionObj._id
            )
          )
        )
          .then((res) => {
            /**Combine the local season data and userGameData into just the data I need to display */
            const tempPerformanceRowArr: PerformanceRow[] = [];
            res.forEach((userGameData, index) => {
              const localSeasonData = allLocalSeasonData.find(
                (seasonData) =>
                  seasonData.competitionStrs.shortHand + seasonData.id ===
                  gameDataCollectionObjArr[index].collectionName
              );
              if (localSeasonData === undefined) {
                throw new Error("Couldn't find local data");
              }
              /**Generate the round performance data for current user as I need their accuracy value */
              userGameData = calcUserGameDataMapPerformance(
                localSeasonData.rounds,
                userGameData
              );
              userGameData = calcRemainingRoundPerformanceData(userGameData);
              for (const entrantType of Object.keys(userGameData.predictions)) {
                const roundPerformance = userGameData.season[entrantType];
                tempPerformanceRowArr.push({
                  accurracy: roundPerformance
                    ? roundPerformance[roundPerformance.length - 1]
                        .percentCorrect
                    : undefined,
                  competitionStrs: localSeasonData.competitionStrs,
                  entrantType: entrantType,
                  leaderboardPos: roundPerformance
                    ? roundPerformance[roundPerformance.length - 1]
                        .leaderboardPos
                    : undefined,
                  seasonStatus: localSeasonData.status,
                  seasonStr: localSeasonData.id,
                });
              }
            });
            /**Sort put rows which are completed at the bottom, else keep their order */
            tempPerformanceRowArr.sort((compA, compB) => {
              if (
                compA.seasonStatus === "completed" &&
                compB.seasonStatus !== "completed"
              )
                return 1;
              if (
                compA.seasonStatus !== "completed" &&
                compB.seasonStatus === "completed"
              )
                return -1;
              return -1;
            });
            setPerformanceRowArr(tempPerformanceRowArr);
          })
          .catch((err) => {
            reject(err);
          });
      });
    };

    /**Merge all local season data */
    const allLocalSeasonData = allF1SeasonData.concat(
      allEurovisionSeasonData,
      allPlSeasonData
    );

    /**Get all strings from `predictionsMadeFor` via the user session */
    let gameDataCollectionObjArr = getCollectionObjFromPredictionsMadeFor(user);

    if (gameDataCollectionObjArr === null) {
      setPerformanceRowArr([]);
    } else {
      getAllGameDataForUser(gameDataCollectionObjArr);
    }
  }, [user]);

  const noOfSkeleRows = 3;
  return (
    <>
      <PanelHeading>
        <h2>Performance Overview</h2>
      </PanelHeading>
      {performanceRowArr === null ? (
        <div className={skeleStyles.con}>
          {Array.from(Array(noOfSkeleRows).keys())
            .reverse()
            .map((reverseIndex, _) => {
              const no = reverseIndex + 1;
              const gap = (1 / (noOfSkeleRows - 1)) * no;
              const firstValue = gap - 1 / (noOfSkeleRows - 1);
              const secondValue = gap;
              return (
                <div
                  className={skeleStyles.row}
                  key={no}
                  style={{
                    maskImage: `-webkit-gradient(
              linear,
              left 90%,
              left top,
              from(rgba(0, 0, 0, ${no === noOfSkeleRows ? 1 : firstValue})),
              to(rgba(0, 0, 0, ${no === noOfSkeleRows ? 1 : secondValue}))
            )`,
                  }}></div>
              );
            })}
        </div>
      ) : performanceRowArr.length === 0 ? (
        <Panel>
          <p>You haven&apos;t made any predictions yet.</p>
          <p>
            Please visit the competitions page below to see if there are any
            open to predictions at the moment.
          </p>
          <div className={btnConstyles.single}>
            <Link href={"competitions"} className={btnStyles.button}>
              View Competitions
            </Link>
          </div>
        </Panel>
      ) : (
        <table className={styles.competitions}>
          <thead>
            <tr>
              <th>Competition/Season</th>
              <th>Position</th>
              <th>Accuracy</th>
              <th>Season Status</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {performanceRowArr.map((performanceRow) => {
              const {
                accurracy,
                competitionStrs,
                entrantType,
                leaderboardPos,
                seasonStatus,
                seasonStr,
              } = performanceRow;
              return (
                <tr
                  key={competitionStrs.shortHand}
                  className={styles.competition}>
                  <td>
                    <div className={styles.name}>
                      <Icon
                        type={
                          competitionStrs.shortHand === "eurovision"
                            ? "microphone"
                            : competitionStrs.shortHand === "f1"
                            ? "f1"
                            : competitionStrs.shortHand === "pl"
                            ? "premierLeague"
                            : "group"
                        }
                        strokeWidth={2}
                      />
                      <p>
                        {competitionStrs.display} {seasonStr}{" "}
                        {competitionStrs.shortHand === "f1" && (
                          <>
                            {` - ${
                              entrantType === "teams"
                                ? "Constructors"
                                : toTitleCase(entrantType)
                            }`}
                          </>
                        )}
                      </p>
                    </div>
                  </td>
                  <td className={styles.pos_cell}>
                    {leaderboardPos ? (
                      <p>
                        <span className={styles.mobOnlyLabel}>
                          Position:{" "}
                          {/**@todo Would be nice to add how many other players there were/are */}
                        </span>{" "}
                        {numberToOrdinalNumber(leaderboardPos)}
                      </p>
                    ) : (
                      ""
                    )}
                  </td>
                  <td className={styles.accuracy_cell}>
                    {accurracy ? (
                      <p>
                        <span className={styles.mobOnlyLabel}>Accuracy: </span>{" "}
                        {accurracy + "%"}
                      </p>
                    ) : (
                      ""
                    )}
                  </td>
                  <td className={styles.status}>
                    {seasonStatus !== "completed" ? <p>{seasonStatus}</p> : ""}
                  </td>
                  <td>
                    {seasonStatus === "predictions open" ? (
                      <Link
                        href={`/${competitionStrs.hyphenated}/${seasonStr}/predict`}
                        className={btnStyles.button}>
                        Edit Predictions
                      </Link>
                    ) : seasonStatus === "predictions closed" ? (
                      <Link
                        href={`/${competitionStrs.hyphenated}/${seasonStr}/your-predictions`}
                        className={btnStyles.button}>
                        View Predictions
                      </Link>
                    ) : (
                      <Link
                        href={`/${competitionStrs.hyphenated}/${seasonStr}/${
                          competitionStrs.shortHand === "f1" &&
                          entrantType === "teams"
                            ? "?leaderboard=constructors"
                            : ""
                        }`}
                        className={btnStyles.button}>
                        View
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
};
