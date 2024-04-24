import { getServerSession } from "next-auth/next";
import { NextPage } from "next";
import { notFound } from "next/navigation";

import { authOptions } from "@lib/auth";
import { allSeasonData } from "@data/formula-1/season-data";
import { getStatsDataQuery } from "@lib/db-functions";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { EntrantPredictions } from "@components/stats/entrant-predictions/entrant-predictions";
import { PromptPredictions } from "@components/submit-predictions/prompt-predictions";
import { HeadToHeads } from "@components/stats/entrant-predictions/head-to-heads";
import { EntrantAccuracy } from "@components/stats/entrant-predictions/entrant-accuracy";

import styles from "@components/stats/stats.module.scss";

import { Entrants } from "@custom-types/game-types";
import { PageProps } from "@custom-types/misc";

export async function generateStaticParams() {
  return Object.keys(allSeasonData).map((season) => ({
    season: season,
  }));
}

const Page: NextPage<PageProps> = async ({ params }) => {
  const { season } = params;
  if (allSeasonData[season] === undefined) notFound();
  const { drivers, teams, rounds, predictionFreezeTime, isSeasonOver } =
    allSeasonData[season];

  const session = await getServerSession(authOptions);
  const currentUserDisplayName = session?.user.displayName;

  const entrants: {
    [key: string]: Entrants;
  } = {
    driver: drivers,
    team: teams,
  };

  const statsData = await getStatsDataQuery(season, "f1");

  /**Combine entrant data with their stats */
  for (const entrantType of Object.keys(entrants)) {
    for (const entrantSName of Object.keys(entrants[entrantType])) {
      entrants[entrantType][entrantSName] = {
        ...entrants[entrantType][entrantSName],
        ...statsData.entrantStats[`${entrantType}s`][entrantSName],
      };
    }
  }

  /**Combine round data with their stats */
  rounds.forEach((round, index) => {
    rounds[index] = { ...round, ...statsData.roundStats[index] };
  });

  return (
    <>
      <PanelHeading>
        <h1>Formula 1 {season} - Driver & Team Stats</h1>
      </PanelHeading>
      {rounds.length < 1 ? (
        <Panel>
          <p>
            Once the first race of the season completes, various stats will show
            on this page for each of the drivers and teams.
          </p>
          <PromptPredictions
            isSignedIn={Boolean(currentUserDisplayName)}
            predictionFreezeTime={predictionFreezeTime}
          />
        </Panel>
      ) : (
        <>
          <Panel>
            <h2>Prediction Stats</h2>
            <div className={styles.entrantPredictions}>
              <EntrantPredictions
                entrants={JSON.parse(JSON.stringify(entrants))}
              />
              <EntrantAccuracy
                entrants={JSON.parse(JSON.stringify(entrants))}
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
              driverIdArr={rounds[0].standings["driver"]}
              entrants={JSON.parse(JSON.stringify(entrants))}
              teamIdArr={rounds[rounds.length - 1].standings["team"]}
            />
          </Panel>
        </>
      )}
    </>
  );
};

export default Page;
