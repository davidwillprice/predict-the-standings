import { unstable_cache } from "next/cache";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@lib/auth";
import { getAllPredictonData } from "@lib/game-functions";
import { allSeasonData } from "@data/formula-1/season-data";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { EntrantPredictions } from "@components/stats/entrant-predictions/entrant-predictions";
import { FeedbackContainer } from "@components/feedback-container/feedback-container";
import { PromptPredictions } from "@components/submit-predictions/prompt-predictions";
import { HeadToHeads } from "@components/stats/entrant-predictions/head-to-heads";

import styles from "@components/stats/stats.module.scss";

import { Sport } from "@custom-types/misc";
import { PredictionData } from "@custom-types/game-types";

const season = "2024";
const sport: Sport = "f1";
const {
  drivers: initialDrivers,
  teams: initialTeams,
  rounds,
  predictionFreezeTime,
} = allSeasonData["2024"];

const getCachedPredictionData = unstable_cache(
  /**@todo Instead of it being time based, revalidate based on when the website is deployed as that's how I'll be adding new race data */
  async () => {
    try {
      return await getAllPredictonData(
        initialDrivers,
        initialTeams,
        rounds,
        season,
        sport
      );
    } catch (_) {
      console.log("Failed to getAllPredictonData()");
    }
  },
  [season, sport]
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
    } else {
      error = "Unknown front-end error";
    }
  }
  /**@todo Stat for copying last years standings */
  /**@todo Record how many times people update their standings for a '"Jack submitted X predictions, Y more than anybody else. Indecisive."' stat */
  return (
    <>
      <PanelHeading>
        <h1>Formula 1 {season} - Driver & Team Stats</h1>
      </PanelHeading>
      {rounds.length < 1 ? (
        <>
          <Panel>
            <p>
              Once the first race of the season completes, various stats will
              show on this page for each of the drivers, teams and players.
            </p>
            <PromptPredictions
              currentUserDisplayName={currentUserDisplayName}
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
            <h2>Prediction Stats</h2>
            <div className={styles.entrantPredictions}>
              <EntrantPredictions
                predictionData={JSON.parse(JSON.stringify(predictionData))}
              />
            </div>
          </Panel>
          <Panel>
            <HeadToHeads
              drivers={predictionData.rounds[0].standings["driver"]}
              teams={
                predictionData.rounds[predictionData.rounds.length - 1]
                  .standings["team"]
              }
            />
          </Panel>
        </>
      )}
    </>
  );
};

export default Page;
