import { NextPage } from "next";
import { getServerSession } from "next-auth/next";
import { notFound } from "next/navigation";

import { getlastUpdatedDate } from "@lib/db-functions";

import { authOptions } from "@lib/auth";
import { allEurovisionSeasonData } from "@data/eurovision/season-data";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { GameContainer } from "@components/game/game-container";
import { PreSeasonContainer } from "@components/game/pre-season-container";
import { PromptPredictions } from "@components/submit-predictions/prompt-predictions";

import { PageProps } from "@custom-types/misc";

export async function generateStaticParams() {
  return Object.keys(allEurovisionSeasonData).map((season) => ({
    season: season,
  }));
}

const Page: NextPage<PageProps> = async ({ params, searchParams }) => {
  const { season } = params;
  const competition = "eurovision";

  if (allEurovisionSeasonData[season] === undefined) notFound();
  const { rounds, predictionFreezeTime, predictionsOpen } =
    allEurovisionSeasonData[season];

  const session = await getServerSession(authOptions);
  const currentUserId = session?.user.id;
  const currentUserDisplayName = session?.user.displayName;

  const lastUpdated = await getlastUpdatedDate(season, competition);

  const heading = <h1>Eurovision {season} - Leaderboard</h1>;

  return (
    <>
      {rounds.length < 1 ? (
        <>
          <PanelHeading>{heading}</PanelHeading>
          <Panel>
            <p>
              Once Eurovision {season} is over, the leaderboard will show here
              and you&apos;ll be able to compare how well everyone predicted the
              results.
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
          competition={competition}
          currentUserDisplayName={currentUserDisplayName}
          currentUserId={currentUserId}
          currentSearchParams={searchParams}
          lastUpdated={lastUpdated}
          localSeasonData={JSON.parse(
            JSON.stringify(allEurovisionSeasonData[season])
          )}
          rounds={JSON.parse(JSON.stringify(rounds))}
          season={season}>
          <div>
            {heading}
            <p>
              Select players to view their predictions and compare them to the
              actual results.
            </p>
          </div>
        </GameContainer>
      )}
    </>
  );
};

export default Page;
