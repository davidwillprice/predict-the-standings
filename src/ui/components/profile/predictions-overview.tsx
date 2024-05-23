"use client";

import { useEffect, useState } from "react";
import { getSingleUserPredictionDataQuery } from "@lib/db-functions";

import { allF1SeasonData } from "@data/formula-1/season-data";
import { allEurovisionSeasonData } from "@data/eurovision/season-data";

import Link from "next/link";
import { PanelHeading } from "@components/panels/panel-heading";
import Icon from "@ui/svgs/icons/sq-icon";
import { numberToOrdinalNumber, toTitleCase } from "@lib/misc";

import { User } from "next-auth";
import { CompetitionStrings } from "@custom-types/game-types";

import styles from "@styles/competitions.module.scss";
import btnStyles from "@components/button/button.module.scss";

interface Props {
  user: User;
}

interface PredictionsOverviewRow {
  accurracy: number | null;
  competitionStrs: CompetitionStrings;
  entrantType: string;
  leaderboardPos: number | null;
  seasonStatus: string;
  seasonStr: string;
}

export const PredictionsOverview = ({ user }: Props) => {
  const [predictionsOverviewRowArr, setPredictionsOverviewRowArr] = useState<
    PredictionsOverviewRow[] | null
  >(null);

  useEffect(() => {
    console.log(allEurovisionSeasonData);
    const allLocalSeasonData = allF1SeasonData.concat(allEurovisionSeasonData);

    let gameDataCollections: string[] = [];
    for (const [competition, seasonArr] of Object.entries(
      user.predictionsMadeFor
    )) {
      seasonArr.forEach((seasonStr) =>
        gameDataCollections.push(competition + seasonStr)
      );
    }

    const getAllGameDataForUser = () => {
      return new Promise((_, reject) => {
        Promise.all(
          gameDataCollections.map((collectionName) =>
            getSingleUserPredictionDataQuery(collectionName, "", user.id)
          )
        )
          .then((res) => {
            const tempPredictionsOverviewRowArr: PredictionsOverviewRow[] = [];
            res.forEach((userGameData, index) => {
              const localSeasonData = allLocalSeasonData.find(
                (seasonData) =>
                  seasonData.competitionStrs.shortHand + seasonData.id ===
                  gameDataCollections[index]
              );
              if (localSeasonData === undefined) {
                throw new Error("Couldn't find local data");
              }
              for (const entrantType of Object.keys(userGameData.predictions)) {
                tempPredictionsOverviewRowArr.push({
                  accurracy:
                    userGameData.season[entrantType][
                      userGameData.season[entrantType].length - 1
                    ].percentCorrect || null,
                  competitionStrs: localSeasonData.competitionStrs,
                  entrantType: entrantType,
                  leaderboardPos:
                    userGameData.season[entrantType][
                      userGameData.season[entrantType].length - 1
                    ].leaderboardPos || null,
                  seasonStatus: localSeasonData.status,
                  seasonStr: localSeasonData.id,
                });
              }
            });
            setPredictionsOverviewRowArr(tempPredictionsOverviewRowArr);
          })
          .catch((err) => {
            reject(err);
          });
      });
    };

    getAllGameDataForUser();
  }, [user]);
  return (
    <>
      <PanelHeading>
        <h2>Predictions Overview</h2>
      </PanelHeading>
      {/**@todo Add loading skeleton */}
      {/**@todo Add message if user has no predictions */}
      {predictionsOverviewRowArr && (
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
            {predictionsOverviewRowArr.map((predictionsOverviewRow) => {
              const {
                accurracy,
                competitionStrs,
                entrantType,
                leaderboardPos,
                seasonStatus,
                seasonStr,
              } = predictionsOverviewRow;
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
                            : "group"
                        }
                        strokeWidth={2}
                      />
                      <p>
                        {competitionStrs.display} {seasonStr}{" "}
                        {competitionStrs.shortHand === "f1" && (
                          <>
                            <br />
                            {entrantType === "teams"
                              ? "Constructors"
                              : toTitleCase(entrantType)}
                          </>
                        )}
                      </p>
                    </div>
                  </td>
                  <td>
                    <span className={styles.mobOnlyLabel}>
                      Leaderboard Position:{" "}
                    </span>
                    {leaderboardPos && numberToOrdinalNumber(leaderboardPos)}
                  </td>
                  <td>
                    <span className={styles.mobOnlyLabel}>Accuracy: </span>
                    {accurracy}%
                  </td>
                  <td className={styles.status}>{seasonStatus}</td>
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
                        View Leaderboard
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
