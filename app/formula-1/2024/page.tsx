import { unstable_cache } from "next/cache";
import { getServerSession } from "next-auth/next";
import Link from "next/link";

import { authOptions } from "@lib/auth";
import { getAllPredictonData } from "@lib/game-functions";
import { allSeasonData } from "@data/formula-1/season-data";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { GameContainer } from "@components/game/game-container";
import { PreSeasonContainer } from "@components/game/pre-season-container";
import { FeedbackContainer } from "@components/feedback-container/feedback-container";
import Icon from "@svgs/icons/sq-icon";

import btnConStyles from "@components/button/button-containers.module.scss";
import btnStyles from "@components/button/button.module.scss";

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
    } else {
      error = "Unknown front-end error";
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
            <hr />
            <div className={btnConStyles.single}>
              <Link href="/formula-1/predict" className={btnStyles.button}>
                <Icon strokeWidth={2} type="listBullet" />
                {currentUserDisplayName
                  ? "Edit Your Predictions"
                  : "Predict The Standings"}
              </Link>
            </div>
          </Panel>
          {/**@todo Re-enable preseason container once properly built - Or could have the below text show as a modal and then underneath a placeholder of what the leaderboard will look like?
           * <PreSeasonContainer />*/}
        </>
      ) : error || !predictionData ? (
        <FeedbackContainer iconType={"error"}>
          <p>{error}</p>
        </FeedbackContainer>
      ) : (
        <GameContainer
          currentUserDisplayName={currentUserDisplayName}
          lastUpdated={predictionData.lastUpdated}
          rounds={JSON.parse(JSON.stringify(predictionData.rounds))}
          currentSearchParams={searchParams}
          users={JSON.parse(JSON.stringify(predictionData.users))}>
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
