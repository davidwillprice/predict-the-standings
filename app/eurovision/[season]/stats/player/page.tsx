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
import { allEurovisionSeasonData } from "@data/eurovision/season-data";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { PromptPredictions } from "@components/submit-predictions/prompt-predictions";
import { Controversy } from "@components/stats/player/controversy";
import { LoadingSpinner } from "@components/loading-spinner/loading-spinner";

import { User } from "@custom-types/game-types";
import { PageProps } from "@custom-types/misc";

export async function generateStaticParams() {
  return Object.keys(allEurovisionSeasonData).map((season) => ({
    season: season,
  }));
}

const Page: NextPage<PageProps> = async ({ params }) => {
  const { season } = params;
  const competition = "eurovision";

  if (allEurovisionSeasonData[season] === undefined) notFound();
  const { allEntrants, rounds, predictionFreezeTime } =
    allEurovisionSeasonData[season];

  const session = await getServerSession(authOptions);
  const currUserId = session?.user.id;

  let currUser: User | null;
  /**@todo Should be refactored into function */
  if (currUserId) {
    const res = await getSingleUserPredictionDataQuery(
      season,
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
      userType: res.userType,
    };
  } else {
    currUser = null;
  }

  const { controversialUserIds } = await getStatsDataQuery(season, competition);

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
  const users = await getMultipleUserGameData(
    allEntrants,
    season,
    competition,
    noteworthyUserIds
  );

  /**@todo Stat for copying last year's standings */
  /**@todo Record how many times people update their standings for a '"Jack submitted X predictions, Y more than anybody else. Indecisive."' stat */
  /**@todo "X, Y, and Z were the only players to predict Hamilton would win the WDC" */

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PanelHeading>
        <h1>Eurovision {season} - Player Stats</h1>
      </PanelHeading>
      {rounds.length < 1 ? (
        <>
          <Panel>
            <p>
              Once Eurovision {season} is over, various player stats will show
              on this page.
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
