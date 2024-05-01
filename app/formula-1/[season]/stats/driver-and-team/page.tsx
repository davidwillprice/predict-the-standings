import { getServerSession } from "next-auth/next";
import { NextPage } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { authOptions } from "@lib/auth";
import { allF1SeasonData } from "@data/formula-1/season-data";
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
  return Object.keys(allF1SeasonData).map((season) => ({
    season: season,
  }));
}

const Page: NextPage<PageProps> = async ({ params }) => {
  const { season } = params;
  const competition = "f1";
  const seasonData = allF1SeasonData.find(
    (seasonData) => seasonData.id === season
  );
  if (seasonData === undefined) notFound();

  const { rounds, predictionFreezeTime, isSeasonOver, predictionsOpen } =
    seasonData;
  const { allEntrants } = seasonData;

  const session = await getServerSession(authOptions);
  const currentUserDisplayName = session?.user.displayName;

  const statsData = await getStatsDataQuery(season, "f1");

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
  const heading = (
    <PanelHeading>
      <h1>Formula 1 {season} - Driver & Team Stats</h1>
    </PanelHeading>
  );
  return (
    <>
      {rounds.length < 1 ? (
        <>
          {heading}
          <Panel>
            <p>
              Once the first race of the season completes, various stats will
              show on this page for each of the drivers and teams.
            </p>
            <PromptPredictions
              competition={competition}
              isSignedIn={Boolean(currentUserDisplayName)}
              predictionFreezeTime={predictionFreezeTime}
              predictionsOpen={predictionsOpen}
              season={season}
            />
          </Panel>
        </>
      ) : (
        <>
          <Suspense fallback={<LoadingSpinner />}>
            {heading}
            <Panel>
              <h2>Prediction Stats</h2>
              <div className={styles.entrantPredictions}>
                <EntrantPredictions
                  allEntrants={JSON.parse(JSON.stringify(allEntrants))}
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
            <Panel>
              <HeadToHeads
                driverIdArr={rounds[0].standings["drivers"]}
                allEntrants={JSON.parse(JSON.stringify(allEntrants))}
                teamIdArr={rounds[rounds.length - 1].standings["teams"]}
              />
            </Panel>
          </Suspense>
        </>
      )}
    </>
  );
};

export default Page;
