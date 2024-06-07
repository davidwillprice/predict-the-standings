import { Suspense } from "react";

import { getStatsDataQuery } from "@lib/db-functions";

import { Panel } from "@components/panels/panel";
import { EntrantPredictions } from "@components/stats/entrant-predictions/entrant-predictions";
import { PromptPredictions } from "@components/submit-predictions/prompt-predictions";
import { HeadToHeads } from "@components/stats/entrant-predictions/head-to-heads";
import { EntrantAccuracy } from "@components/stats/entrant-predictions/entrant-accuracy";
import { LoadingSpinner } from "@components/loading-spinner/loading-spinner";

import styles from "@components/stats/stats.module.scss";

import { LocalSeasonData, StatsData } from "@custom-types/game-types";
import { UserDataFromSession } from "@custom-types/misc";

type Props = {
  currUser: UserDataFromSession | undefined;
  preseasonText: string;
  seasonData: LocalSeasonData;
};

export const EntrantStats = async ({
  currUser,
  preseasonText,
  seasonData,
}: Props) => {
  const {
    arePredictionsFrozen,
    allEntrants,
    competitionStrs,
    id: seasonStr,
    isSeasonOver,
    predictionsOpen,
    rounds,
  } = seasonData;

  /**If there is round data, get the stats for competition/season*/
  let statsData: StatsData | undefined;
  if (rounds.length > 0) {
    statsData = await getStatsDataQuery(seasonStr, competitionStrs.shortHand);

    /**Combine entrant data with their stats */
    for (const entrantType of Object.keys(allEntrants)) {
      for (const entrantSName of Object.keys(allEntrants[entrantType])) {
        allEntrants[entrantType][entrantSName] = {
          ...allEntrants[entrantType][entrantSName],
          ...statsData.allEntrants[entrantType][entrantSName],
        };
      }
    }
    /**Combine round data with their stats */
    rounds.forEach((round, index) => {
      rounds[index] = { ...round, ...statsData?.rounds[index] };
    });
  }

  return (
    <>
      {rounds.length > 0 && statsData ? (
        <Suspense fallback={<LoadingSpinner />}>
          <Panel>
            <h2>Prediction Stats</h2>
            <div className={styles.entrantPredictions}>
              <EntrantPredictions
                allEntrants={JSON.parse(JSON.stringify(allEntrants))}
                lastRound={isSeasonOver ? rounds[rounds.length - 1] : null}
              />
              <hr />
              <EntrantAccuracy
                entrants={JSON.parse(JSON.stringify(allEntrants))}
                isSeasonOver={isSeasonOver}
                noOfPredictions={JSON.parse(
                  JSON.stringify(statsData.noOfPredictions)
                )}
                rounds={JSON.parse(JSON.stringify(rounds))}
              />
            </div>
          </Panel>
          {competitionStrs.shortHand === "f1" && (
            <Panel>
              <HeadToHeads
                allEntrants={JSON.parse(JSON.stringify(allEntrants))}
                driverIdArr={rounds[0].standings["drivers"]}
                lastRound={isSeasonOver ? rounds[rounds.length - 1] : null}
                teamIdArr={rounds[rounds.length - 1].standings["teams"]}
              />
            </Panel>
          )}
        </Suspense>
      ) : (
        <Panel>
          <p>{preseasonText}</p>
          <PromptPredictions
            competitionStrs={competitionStrs}
            currUser={currUser}
            arePredictionsFrozen={arePredictionsFrozen}
            predictionsOpen={predictionsOpen}
            seasonStr={seasonStr}
          />
        </Panel>
      )}
    </>
  );
};
