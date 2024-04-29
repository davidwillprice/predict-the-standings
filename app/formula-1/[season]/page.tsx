import { NextPage } from "next";
import { getServerSession } from "next-auth/next";
import { notFound } from "next/navigation";

import { getlastUpdatedDate } from "@lib/db-functions";

import { authOptions } from "@lib/auth";
import { allF1SeasonData } from "@data/formula-1/season-data";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { GameContainer } from "@components/game/game-container";
import { PreSeasonContainer } from "@components/game/pre-season-container";
import { PromptPredictions } from "@components/submit-predictions/prompt-predictions";

import { PageProps } from "@custom-types/misc";

export async function generateStaticParams() {
  return Object.keys(allF1SeasonData).map((season) => ({
    season: season,
  }));
}

const Page: NextPage<PageProps> = async ({ params, searchParams }) => {
  const { season } = params;
  const competition = "f1";
  if (allF1SeasonData[season] === undefined) notFound();
  const { allEntrants, rounds, predictionFreezeTime, predictionsOpen } =
    allF1SeasonData[season];

  const session = await getServerSession(authOptions);
  const currentUserId = session?.user.id;
  const currentUserDisplayName = session?.user.displayName;

  const lastUpdated = await getlastUpdatedDate(season, competition);

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
              competition={competition}
              isSignedIn={Boolean(currentUserDisplayName)}
              predictionFreezeTime={predictionFreezeTime}
              predictionsOpen={predictionsOpen}
              season={season}
            />
          </Panel>
          {/**@todo Re-enable preseason container once properly built - Or could have the below text show as a modal and then underneath a placeholder of what the leaderboard will look like?
           * <PreSeasonContainer />*/}
        </>
      ) : (
        <GameContainer
          currentUserDisplayName={currentUserDisplayName}
          currentUserId={currentUserId}
          currentSearchParams={searchParams}
          entrants={JSON.parse(JSON.stringify(allEntrants))}
          lastUpdated={lastUpdated}
          rounds={JSON.parse(JSON.stringify(rounds))}
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
