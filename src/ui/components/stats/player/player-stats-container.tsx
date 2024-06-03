import { Suspense } from "react";

import {
  getUserGameDataQuery,
  getStatsDataQuery,
  getMultipleUserGameData,
} from "@lib/db-functions";
import { getSpecificGameDataIdFromSessionUser } from "@lib/misc";

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

  let currUserGameData: UserGameData | null = null;

  /**If the user has game data for this comp/season, get that data from the DB*/
  const gameDataId: string | undefined = getSpecificGameDataIdFromSessionUser(
    seasonStr,
    competitionStrs.shortHand,
    currUser
  );
  if (gameDataId && rounds.length > 0) {
    const res = await getUserGameDataQuery(
      seasonStr,
      competitionStrs.shortHand,
      gameDataId
    );
    if (res) currUserGameData = res;
  }

  /**If there is round data for the comp/season, query the player stats data from the DB, and then get the full userGameData referenced in those stats*/
  let controversialGameDataIdMap,
    lastSubmittedGameDataId,
    leaderboardToppingGameDataIdMap,
    mostUpdatedGameDataIdArr,
    gameDataMap,
    noteworthyGameDataIds: string[] = [];

  if (rounds.length > 0) {
    const statsData = await getStatsDataQuery(
      seasonStr,
      competitionStrs.shortHand
    );

    ({
      controversialGameDataIdMap,
      lastSubmittedGameDataId,
      leaderboardToppingGameDataIdMap,
      mostUpdatedGameDataIdArr,
    } = statsData);

    /**Obtain game data for all the _id stored in the controversy Id obj and mostUpdatedGameDataIdArr */
    for (const entrantType of Object.keys(controversialGameDataIdMap)) {
      controversialGameDataIdMap[entrantType].most.forEach((_id) =>
        noteworthyGameDataIds.push(_id)
      );
      controversialGameDataIdMap[entrantType].least.forEach((_id) =>
        noteworthyGameDataIds.push(_id)
      );
    }
    /**Obtain game data for all the _id stored in the leaderboardToppingGameDataIdMap */
    for (const arr of Object.values(leaderboardToppingGameDataIdMap)) {
      arr.forEach((userToppingData) => {
        noteworthyGameDataIds.push(userToppingData._id);
      });
    }

    noteworthyGameDataIds = noteworthyGameDataIds.concat(
      mostUpdatedGameDataIdArr,
      lastSubmittedGameDataId
    );

    gameDataMap = await getMultipleUserGameData(
      seasonStr,
      competitionStrs.shortHand,
      //Turn into a set to querying to avoid querying for duplicate userGameData
      [...new Set(noteworthyGameDataIds)]
    );
  }

  const isOneRoundSeason = isSeasonOver && rounds.length === 1;

  /**@todo Stat for copying last year's standings */
  /**@todo "X, Y, and Z were the only players to predict Hamilton would win the WDC" */
  /**@todo Leaderboard based on xG for football? */
  /**@todo Table of which entrants is causing the logged in user the biggest issues? */
  return (
    <>
      {rounds.length > 0 && controversialGameDataIdMap !== undefined ? (
        <Suspense fallback={<LoadingSpinner />}>
          <Panel>
            <Controversy
              controversialGameDataIdMap={controversialGameDataIdMap}
              currUser={currUserGameData}
              gameDataMap={JSON.parse(JSON.stringify(gameDataMap))}
            />
          </Panel>
          {mostUpdatedGameDataIdArr &&
            mostUpdatedGameDataIdArr.length !== 0 && (
              <Panel>
                <MostUpdated
                  mostUpdatedGameDataIdArr={mostUpdatedGameDataIdArr}
                  currUser={currUserGameData}
                  gameDataMap={JSON.parse(JSON.stringify(gameDataMap))}
                />
              </Panel>
            )}
          {lastSubmittedGameDataId && (
            <LastestSubmission
              currUser={currUserGameData}
              predictionFreezeDate={seasonData.predictionFreezeDate}
              gameDataId={lastSubmittedGameDataId}
              gameDataMap={JSON.parse(JSON.stringify(gameDataMap))}
            />
          )}
          {leaderboardToppingGameDataIdMap && !isOneRoundSeason && (
            <LeaderboardToppers
              competitionStrs={competitionStrs}
              currUserId={currUser?.id}
              isSeasonOver={isSeasonOver}
              leaderboardToppingGameDataIdMap={leaderboardToppingGameDataIdMap}
              seasonStr={seasonData.id}
              gameDataMap={JSON.parse(JSON.stringify(gameDataMap))}
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
