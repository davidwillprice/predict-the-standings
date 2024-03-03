import { unstable_cache } from "next/cache";
import { getServerSession } from "next-auth/next";
import { NextPage } from "next";
import { notFound } from "next/navigation";

import { authOptions } from "@lib/auth";
import { getAllPredictionData } from "@lib/game-functions";
import { allSeasonData } from "@data/formula-1/season-data";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { FeedbackContainer } from "@components/feedback-container/feedback-container";
import { PromptPredictions } from "@components/submit-predictions/prompt-predictions";
import { Controversy } from "@components/stats/player/controversy";

import { PredictionData } from "@custom-types/game-types";
import { PageProps } from "@custom-types/misc";

export async function generateStaticParams() {
  return Object.keys(allSeasonData).map((season) => ({
    season: season,
  }));
}

const Page: NextPage<PageProps> = async ({ params }) => {
  const { season } = params;
  if (allSeasonData[season] === undefined) notFound();
  const {
    drivers: initialDrivers,
    teams: initialTeams,
    rounds,
    predictionFreezeTime,
    isSeasonOver,
  } = allSeasonData[season];

  const getCachedPredictionData = unstable_cache(
    /**@todo Instead of it being time based, revalidate based on when the website is deployed as that's how I'll be adding new race data */
    async () => {
      try {
        return await getAllPredictionData(
          initialDrivers,
          initialTeams,
          rounds,
          season,
          "f1"
        );
      } catch (_) {
        console.log("Failed to getAllPredictionData()");
      }
    },
    [season, "f1"]
  );

  let error = "";
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user.id;
  let predictionData: PredictionData | undefined;

  try {
    const res = await getCachedPredictionData();
    if (typeof res === "string") {
      error = res;
    } else {
      predictionData = res;
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      error = e.message;
    } else {
      error = "Unknown front-end error";
    }
  }
  /**@todo Stat for copying last years standings */
  /**@todo Record how many times people update their standings for a '"Jack submitted X predictions, Y more than anybody else. Indecisive."' stat */
  return (
    <>
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
              isSignedIn={Boolean(currentUserId)}
              predictionFreezeTime={predictionFreezeTime}
            />
          </Panel>
        </>
      ) : error || !predictionData ? (
        <FeedbackContainer iconType={"error"}>
          <p>{error}</p>
        </FeedbackContainer>
      ) : (
        <>
          <Panel>
            <Controversy
              currentUserId={currentUserId}
              isSeasonOver={isSeasonOver}
              users={JSON.parse(JSON.stringify(predictionData.users))}
            />
          </Panel>
        </>
      )}
    </>
  );
};

export default Page;
