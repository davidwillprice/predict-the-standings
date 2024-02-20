import { useState } from "react";
import { unstable_cache } from "next/cache";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@lib/auth";
import { getAllPredictonData } from "@lib/game-functions";
import { rounds, entrants } from "@data/formula-1/2024";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { GameContainer } from "@components/game/game-container";
import { PreSeasonContainer } from "@components/game/pre-season-container";
import { FeedbackContainer } from "@components/feedback-container/feedback-container";

import { Sport } from "@custom-types/misc";
import { PredictionData } from "@custom-types/game-types";

const season = "2024";
const sport: Sport = "f1";

const getCachedPredictionData = unstable_cache(
  /**@todo Instead of it being time based, revalidate based on when the website is deployed as that's how I'll be adding new race data */
  async () => {
    try {
      return await getAllPredictonData(entrants, rounds, season, sport);
    } catch (_) {
      console.log("Failed to getAllPredictonData()");
    }
  },
  [season, sport],
  { revalidate: 3600 }
);

const Page = async () => {
  let error = "";
  const session = await getServerSession(authOptions);
  const currentUserDisplayName = session?.user.displayName;
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
    }
    error = "Unknown front-end error";
  }
  return (
    <>
      {error || !predictionData ? (
        <FeedbackContainer iconType={"error"}>
          <p>{error}</p>
        </FeedbackContainer>
      ) : predictionData.rounds.length < 1 ? (
        /**@todo Re-enable preseason container once properly built - Or could have the below text show as a modal and then underneath a placeholder of what the leaderboard will look like?
        <PreSeasonContainer
          users={JSON.parse(JSON.stringify(predictionData.users))}
        />*/
        <>
          <PanelHeading>
            <h1>Formula 1 {season} - Leaderboard</h1>
          </PanelHeading>
          <Panel>
            <p>
              Once the first race of the season completes, the leaderboard board
              will show here and you&apos;ll be able to track your position as
              the season progresses.
            </p>
          </Panel>
        </>
      ) : (
        <GameContainer
          currentUserDisplayName={currentUserDisplayName}
          lastUpdated={predictionData.lastUpdated}
          rounds={JSON.parse(JSON.stringify(predictionData.rounds))}
          season={season}
          users={JSON.parse(JSON.stringify(predictionData.users))}
        />
      )}
    </>
  );
};

export default Page;
