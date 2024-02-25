import { unstable_cache } from "next/cache";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@lib/auth";
import { getAllPredictonData } from "@lib/game-functions";
import { allSeasonData } from "@data/formula-1/season-data";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { GameContainer } from "@components/game/game-container";
import { PreSeasonContainer } from "@components/game/pre-season-container";
import { FeedbackContainer } from "@components/feedback-container/feedback-container";
import Icon from "@ui/svgs/icons/sq-icon";
import { Button } from "@components/button/button";

import { Sport } from "@custom-types/misc";
import { PredictionData } from "@custom-types/game-types";

const season = "2024";
const sport: Sport = "f1";
const { drivers, teams, rounds } = allSeasonData["2024"];

const getCachedPredictionData = unstable_cache(
  /**@todo Instead of it being time based, revalidate based on when the website is deployed as that's how I'll be adding new race data */
  async () => {
    try {
      return await getAllPredictonData(drivers, teams, rounds, season, sport);
    } catch (_) {
      console.log("Failed to getAllPredictonData()");
    }
  },
  [season, sport],
  { revalidate: 3600 }
);

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

const Page = async ({ searchParams }: Props) => {
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

  const heading = (
    <h1>
      Formula 1 {season} -{" "}
      {searchParams.leaderboard === "constructors" ? "Constructors" : "Drivers"}{" "}
      Leaderboard
    </h1>
  );

  return (
    <>
      {error || !predictionData ? (
        <FeedbackContainer iconType={"error"}>
          <p>{error}</p>
        </FeedbackContainer>
      ) : predictionData.rounds.length < 1 ? (
        <>
          <PanelHeading>{heading}</PanelHeading>
          <Panel>
            <p>
              Once the first race of the season completes, the leaderboard board
              will show here and you&apos;ll be able to track everyone&apos;s
              prediction performance as the season progresses.
            </p>
          </Panel>
          {/**@todo Re-enable preseason container once properly built - Or could have the below text show as a modal and then underneath a placeholder of what the leaderboard will look like?
           * <PreSeasonContainer />*/}
        </>
      ) : (
        <GameContainer
          currentUserDisplayName={currentUserDisplayName}
          lastUpdated={predictionData.lastUpdated}
          rounds={JSON.parse(JSON.stringify(predictionData.rounds))}
          currentSearchParams={searchParams}
          users={JSON.parse(JSON.stringify(predictionData.users))}>
          <div style={{ display: "flex" }}>
            <div>
              {heading}
              <p>
                Select players to view their predictions and compare them to the
                actual standings.
              </p>
            </div>
            <div>
              {/**@todo implement an additional button to change the entrant type
              <Button>
                <Icon type="driver" strokeWidth={2} />
                Drivers
              </Button>
              <Button>
                <Icon type="wrenchScrewdriver" strokeWidth={2} />
                Constructors
              </Button> */}
            </div>
          </div>
        </GameContainer>
      )}
    </>
  );
};

export default Page;
