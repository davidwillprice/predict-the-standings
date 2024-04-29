import { getServerSession } from "next-auth/next";
import { NextPage } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { authOptions } from "@lib/auth";
import { allEurovisionSeasonData } from "@data/eurovision/season-data";
import { getStatsDataQuery } from "@lib/db-functions";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { EntrantPredictions } from "@components/stats/entrant-predictions/entrant-predictions";
import { PromptPredictions } from "@components/submit-predictions/prompt-predictions";
import { HeadToHeads } from "@components/stats/entrant-predictions/head-to-heads";
import { EntrantAccuracy } from "@components/stats/entrant-predictions/entrant-accuracy";
import { LoadingSpinner } from "@components/loading-spinner/loading-spinner";

import styles from "@components/stats/stats.module.scss";

import { PageProps } from "@custom-types/misc";

export async function generateStaticParams() {
  return Object.keys(allEurovisionSeasonData).map((season) => ({
    season: season,
  }));
}

const Page: NextPage<PageProps> = async ({ params }) => {
  const { season } = params;
  if (allEurovisionSeasonData[season] === undefined) notFound();
  const { rounds, predictionFreezeTime, isSeasonOver } =
    allEurovisionSeasonData[season];
  const { allEntrants } = allEurovisionSeasonData[season];

  const session = await getServerSession(authOptions);
  const currentUserDisplayName = session?.user.displayName;

  const statsData = await getStatsDataQuery(season, "eurovision");

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
    rounds[index] = { ...round, ...statsData.rounds[index] };
  });

  return (
    <>
      {rounds.length < 1 ? (
        <>
          <PanelHeading>
            <h1>Eurovision {season} - Country Stats</h1>
          </PanelHeading>
          <Panel>
            <p>
              Once Eurovision {season} is over, various stats will show on this
              page for each of the countries.
            </p>
            <PromptPredictions
              isSignedIn={Boolean(currentUserDisplayName)}
              predictionFreezeTime={predictionFreezeTime}
            />
          </Panel>
        </>
      ) : (
        <>
          <Suspense fallback={<LoadingSpinner />}>
            <PanelHeading>
              <h1>Eurovision {season} - Country Stats</h1>
            </PanelHeading>
            <Panel>
              <h2>Prediction Stats</h2>
              <div className={styles.entrantPredictions}>
                <EntrantPredictions
                  entrants={JSON.parse(JSON.stringify(allEntrants))}
                />
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
          </Suspense>
        </>
      )}
    </>
  );
};

export default Page;
