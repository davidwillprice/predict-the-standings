import { Suspense } from "react";

import {
  getSingleUserPredictionDataQuery,
  getStatsDataQuery,
  getMultipleUserGameData,
} from "@lib/db-functions";

import { Panel } from "@components/panels/panel";
import { PromptPredictions } from "@components/submit-predictions/prompt-predictions";
import { Controversy } from "@components/stats/player/controversy";
import { LastestSubmission } from "./latest-submission";
import { MostUpdated } from "./most-updated";
import { LoadingSpinner } from "@components/loading-spinner/loading-spinner";
import { LeaderboardToppers } from "./leaderboard-toppers";

import { LocalSeasonData, UserGameData } from "@custom-types/game-types";
import { User } from "next-auth";

type Props = {
  currUser: User | undefined;
  preseasonText: string;
  seasonData: LocalSeasonData;
};

export const PlayerStats = async ({
  currUser,
  preseasonText,
  seasonData,
}: Props) => {
  const {
    arePredictionsFrozen,
    competitionStrs,
    id: seasonStr,
    isSeasonOver,
    predictionsOpen,
    rounds,
  } = seasonData;

  /**If the user is logged in and there is round data, get the user's competition data*/
  let currUserGameData: UserGameData | null = null;
  if (currUser && rounds.length > 0) {
    const res = await getSingleUserPredictionDataQuery(
      seasonStr,
      competitionStrs.shortHand,
      currUser.id
    );
    if (res) currUserGameData = res;
  }

  /**If there is round data, get the stats for this competition/season, and then get the users referenced in those stats*/
  let controversialUserIds;
  let latestSubmissionUserId;
  let leaderboardToppingUserIds;
  let mostUpdatedPredictionUserIds;
  /**@todo Make this a set to avoid getting the same user data from the DB multiple times */
  let noteworthyUserIds: string[] = [];
  let users;
  if (rounds.length > 0) {
    const statsData = await getStatsDataQuery(
      seasonStr,
      competitionStrs.shortHand
    );
    controversialUserIds = statsData.controversialUserIds;
    latestSubmissionUserId = statsData.latestSubmissionUserId;
    leaderboardToppingUserIds = statsData.leaderboardToppingUserIds;
    mostUpdatedPredictionUserIds = statsData.mostUpdatedPredictionUserIds;

    /**Obtain game data for all the users referenced in the controversy Id obj and mostUpdatedPredictionUserIds */
    for (const entrantType of Object.keys(controversialUserIds)) {
      controversialUserIds[entrantType].most.forEach((userId) =>
        noteworthyUserIds.push(userId)
      );
      controversialUserIds[entrantType].least.forEach((userId) =>
        noteworthyUserIds.push(userId)
      );
    }
    /**Obtain game data for all the users referenced in the leaderboardToppingUserIds */
    for (const arr of Object.values(leaderboardToppingUserIds)) {
      arr.forEach((userToppingData) => {
        noteworthyUserIds.push(userToppingData.userId);
      });
    }

    noteworthyUserIds = noteworthyUserIds.concat(
      mostUpdatedPredictionUserIds,
      latestSubmissionUserId
    );

    users = await getMultipleUserGameData(
      seasonStr,
      competitionStrs.shortHand,
      noteworthyUserIds
    );
  }

  const isOneRoundSeason = isSeasonOver && rounds.length === 1;

  /**@todo Stat for copying last year's standings */
  /**@todo "X, Y, and Z were the only players to predict Hamilton would win the WDC" */
  /**@todo Leaderboard based on xG for football? */
  /**@todo Table of which entrants is causing the logged in user the biggest issues? */
  return (
    <>
      {rounds.length > 0 && controversialUserIds !== undefined ? (
        <Suspense fallback={<LoadingSpinner />}>
          <Panel>
            <Controversy
              controversialUserIds={controversialUserIds}
              currUser={currUserGameData}
              users={JSON.parse(JSON.stringify(users))}
            />
          </Panel>
          {mostUpdatedPredictionUserIds &&
            mostUpdatedPredictionUserIds.length !== 0 && (
              <Panel>
                <MostUpdated
                  mostUpdatedPredictionUserIds={mostUpdatedPredictionUserIds}
                  currUser={currUserGameData}
                  users={JSON.parse(JSON.stringify(users))}
                />
              </Panel>
            )}
          {latestSubmissionUserId && (
            <LastestSubmission
              currUser={currUserGameData}
              predictionFreezeDate={seasonData.predictionFreezeDate}
              userId={latestSubmissionUserId}
              users={JSON.parse(JSON.stringify(users))}
            />
          )}
          {leaderboardToppingUserIds && !isOneRoundSeason && (
            <LeaderboardToppers
              competitionStrs={competitionStrs}
              currUserId={currUser?.id}
              isSeasonOver={isSeasonOver}
              leaderboardToppingUserIds={leaderboardToppingUserIds}
              seasonStr={seasonData.id}
              users={JSON.parse(JSON.stringify(users))}
            />
          )}
        </Suspense>
      ) : (
        <Panel>
          <p>{preseasonText}</p>
          <PromptPredictions
            arePredictionsFrozen={arePredictionsFrozen}
            competitionStrs={competitionStrs}
            currUser={currUser}
            predictionsOpen={predictionsOpen}
            seasonStr={seasonStr}
          />
        </Panel>
      )}
    </>
  );
};
