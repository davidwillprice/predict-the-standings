import { getServerSession } from "next-auth/next";
import { NextPage } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import {
  getSingleUserPredictionDataQuery,
  getStatsDataQuery,
  getMultipleUserGameData,
} from "@lib/db-functions";

import { authOptions } from "@lib/auth";
import { allSeasonData } from "@data/formula-1/season-data";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { PromptPredictions } from "@components/submit-predictions/prompt-predictions";
import { Controversy } from "@components/stats/player/controversy";
import { LoadingSpinner } from "@components/loading-spinner/loading-spinner";

import { Entrants, User } from "@custom-types/game-types";
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

  const entrants: {
    [key: string]: Entrants;
  } = {
    driver: drivers,
    team: teams,
  };

  const session = await getServerSession(authOptions);
  const currUserId = session?.user.id;

  let currUser: User | null;
  if (currUserId) {
    const res = await getSingleUserPredictionDataQuery(
      season,
      "f1",
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
      userType: res.userType,
    };
  } else {
    currUser = null;
  }

  const { controversialUserIds } = await getStatsDataQuery(season, "f1");

  /**Obtain game data for all the users referenced in the controversy Id obj */
  const noteworthyUserIds: string[] = [];
  for (const entrantType of Object.keys(controversialUserIds)) {
    controversialUserIds[entrantType].most.forEach((userId) =>
      noteworthyUserIds.push(userId)
    );
    controversialUserIds[entrantType].least.forEach((userId) =>
      noteworthyUserIds.push(userId)
    );
  }
  const users = await getMultipleUserGameData(season, "f1", noteworthyUserIds);

  /**@todo Stat for copying last year's standings */
  /**@todo Record how many times people update their standings for a '"Jack submitted X predictions, Y more than anybody else. Indecisive."' stat */
  /**@todo "X, Y, and Z were the only players to predict Hamilton would win the WDC" */

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PanelHeading>
        <h1>Formula 1 {season} - Player Stats</h1>
      </PanelHeading>
      {rounds.length < 1 ? (
        <>
          <Panel>
            <p>
              Once the first race of the season completes, various player stats
              will show on this page.
            </p>
            <PromptPredictions
              isSignedIn={Boolean(currUserId)}
              predictionFreezeTime={predictionFreezeTime}
            />
          </Panel>
        </>
      ) : (
        <>
          <Panel>
            <Controversy
              controversialUserIds={controversialUserIds}
              currUser={currUser}
              users={JSON.parse(JSON.stringify(users))}
            />
          </Panel>
        </>
      )}
    </Suspense>
  );
};

export default Page;
