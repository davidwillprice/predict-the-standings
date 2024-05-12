import { Suspense } from "react";

import {
  getSingleUserPredictionDataQuery,
  getStatsDataQuery,
  getMultipleUserGameData,
} from "@lib/db-functions";

import { Panel } from "@components/panels/panel";
import { PromptPredictions } from "@components/submit-predictions/prompt-predictions";
import { Controversy } from "@components/stats/player/controversy";
import { MostUpdated } from "./most-updated";
import { LoadingSpinner } from "@components/loading-spinner/loading-spinner";

import { LocalSeasonData, User } from "@custom-types/game-types";

type Props = {
  currUserId: string | undefined;
  preseasonText: string;
  seasonData: LocalSeasonData;
};

export const PlayerStats = async ({
  currUserId,
  preseasonText,
  seasonData,
}: Props) => {
  const {
    arePredictionsFrozen,
    allEntrants,
    competition,
    id: seasonStr,
    predictionsOpen,
    rounds,
  } = seasonData;

  /**If the user is logged in and there is round data, get the user's competition data*/
  let currUser: User | null;
  if (currUserId && rounds.length > 0) {
    const res = await getSingleUserPredictionDataQuery(
      seasonStr,
      competition,
      currUserId
    );
    currUser = {
      id: res.userId,
      displayName: res.displayName,
      controversyPercentile: res.controversyPercentile,
      information: res.information,
      lastSubmissionTime: res.lastSubmissionTime,
      predictions: res.predictions,
      predictionsFromAvg: res.predictionsFromAvg,
      season: res.season,
      timesPredictionsUpdated: res.timesPredictionsUpdated,
      userType: res.userType,
    };
  } else {
    currUser = null;
  }

  /**If there is round data, get the stats for this competition/season, and then get the users referenced in those stats*/
  let controversialUserIds;
  let mostUpdatedPredictionUserIds;
  /**@todo Make this a set to avoid getting the same user data from the DB multiple times */
  let noteworthyUserIds: string[] = [];
  let users;
  if (rounds.length > 0) {
    const StatsData = await getStatsDataQuery(seasonStr, competition);
    controversialUserIds = StatsData.controversialUserIds;
    mostUpdatedPredictionUserIds = StatsData.mostUpdatedPredictionUserIds;

    /**Obtain game data for all the users referenced in the controversy Id obj anmd mostUpdatedPredictionUserIds */
    for (const entrantType of Object.keys(controversialUserIds)) {
      controversialUserIds[entrantType].most.forEach((userId) =>
        noteworthyUserIds.push(userId)
      );
      controversialUserIds[entrantType].least.forEach((userId) =>
        noteworthyUserIds.push(userId)
      );
    }

    noteworthyUserIds = noteworthyUserIds.concat(mostUpdatedPredictionUserIds);

    users = await getMultipleUserGameData(
      allEntrants,
      seasonStr,
      competition,
      noteworthyUserIds
    );
  }

  /**@todo Stat for copying last year's standings */
  /**@todo "X, Y, and Z were the only players to predict Hamilton would win the WDC" */
  return (
    <>
      {rounds.length > 0 && controversialUserIds !== undefined ? (
        <Suspense fallback={<LoadingSpinner />}>
          <Panel>
            <Controversy
              controversialUserIds={controversialUserIds}
              currUser={currUser}
              users={JSON.parse(JSON.stringify(users))}
            />
          </Panel>
          {mostUpdatedPredictionUserIds &&
            mostUpdatedPredictionUserIds.length !== 0 && (
              <Panel>
                <MostUpdated
                  mostUpdatedPredictionUserIds={mostUpdatedPredictionUserIds}
                  currUser={currUser}
                  users={JSON.parse(JSON.stringify(users))}
                />
              </Panel>
            )}
        </Suspense>
      ) : (
        <Panel>
          <p>{preseasonText}</p>
          <PromptPredictions
            arePredictionsFrozen={arePredictionsFrozen}
            competition={competition}
            isSignedIn={Boolean(currUserId)}
            predictionsOpen={predictionsOpen}
            season={seasonStr}
          />
        </Panel>
      )}
    </>
  );
};
