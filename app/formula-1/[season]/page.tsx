import { NextPage } from "next";
import { unstable_cache } from "next/cache";
import { getServerSession } from "next-auth/next";
import { notFound } from "next/navigation";

import { authOptions } from "@lib/auth";
import { getAllPredictionData } from "@lib/prediction-data";
import { allSeasonData } from "@data/formula-1/season-data";
import { getAllDisplayNamesQuery } from "@lib/db-functions";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { GameContainer } from "@components/game/game-container";
import { PreSeasonContainer } from "@components/game/pre-season-container";
import { FeedbackContainer } from "@components/feedback-container/feedback-container";
import { PromptPredictions } from "@components/submit-predictions/prompt-predictions";

import { PredictionData, UserIdData } from "@custom-types/game-types";
import { PageProps } from "@custom-types/misc";

export async function generateStaticParams() {
  return Object.keys(allSeasonData).map((season) => ({
    season: season,
  }));
}

const Page: NextPage<PageProps> = async ({ params, searchParams }) => {
  const { season } = params;
  if (allSeasonData[season] === undefined) notFound();
  const {
    drivers: initialDrivers,
    teams: initialTeams,
    rounds,
    predictionFreezeTime,
  } = allSeasonData[season];

  let error = "";
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user.id;
  const currentUserDisplayName = session?.user.displayName;

  const getCachedDisplayNames = unstable_cache(async () => {
    try {
      const test = await getAllDisplayNamesQuery();
      return test.rows;
    } catch (_) {
      console.log("Failed to get display names");
    }
  }, ["displayNames"]);

  let displayNameData: UserIdData[] | undefined;
  try {
    const res = await getCachedDisplayNames();
    if (typeof res === "string") {
      error = res;
    } else if (res === undefined) {
      error = "Display name data is undefined";
    } else {
      displayNameData = res as UserIdData[];
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      error = e.message;
    } else {
      error = "Unknown front-end error";
    }
  }

  const getPredictionData = unstable_cache(async () => {
    try {
      const res = await getAllPredictionData(
        initialDrivers,
        initialTeams,
        rounds,
        season,
        "f1"
      );

      if (typeof res === "string") {
        throw new Error(res);
      }
      console.log("Running getAllPredictionData " + new Date());
      return res;
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      } else {
        throw new Error(
          "Unable to get local predictionData for unknown reason"
        );
      }
    }
  }, ["predictionData"]);

  const predictionData: PredictionData = await getPredictionData();

  if (predictionData && displayNameData) {
    for (const user of Object.values(predictionData.users)) {
      user.displayName =
        displayNameData.find((dbUser) => dbUser.id === user.id)?.display_name ||
        "Average";
    }
  }

  const heading = (
    <h1>
      Formula 1 {season} -{" "}
      {searchParams.leaderboard === "constructors" ? "Constructors" : "Drivers"}{" "}
      Leaderboard
    </h1>
  );

  return (
    <>
      {rounds.length < 1 ? (
        <>
          <PanelHeading>{heading}</PanelHeading>
          <Panel>
            <p>
              Once the first race of the season completes, the{" "}
              {searchParams.leaderboard === "constructors"
                ? "constructors"
                : "drivers"}{" "}
              leaderboard will show here and you&apos;ll be able to track{" "}
              {currentUserDisplayName ? "your" : "everyone&apos;s prediction"}{" "}
              performance as the season progresses.
            </p>
            <PromptPredictions
              isSignedIn={Boolean(currentUserDisplayName)}
              predictionFreezeTime={predictionFreezeTime}
            />
          </Panel>
          {/**@todo Re-enable preseason container once properly built - Or could have the below text show as a modal and then underneath a placeholder of what the leaderboard will look like?
           * <PreSeasonContainer />*/}
        </>
      ) : error || !predictionData || !displayNameData ? (
        <FeedbackContainer iconType={"error"}>
          <p>{error}</p>
        </FeedbackContainer>
      ) : (
        <GameContainer
          currentUserDisplayName={currentUserDisplayName}
          currentUserId={currentUserId}
          entrants={JSON.parse(JSON.stringify(predictionData.entrants))}
          lastUpdated={predictionData.lastUpdated}
          rounds={JSON.parse(JSON.stringify(predictionData.rounds))}
          currentSearchParams={searchParams}
          users={JSON.parse(JSON.stringify(predictionData.users))}
          season={season}>
          <div>
            {heading}
            <p>
              Select players to view their predictions and compare them to the
              actual standings.
            </p>
          </div>
        </GameContainer>
      )}
    </>
  );
};

export default Page;
