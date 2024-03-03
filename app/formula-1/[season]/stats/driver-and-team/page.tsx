import { unstable_cache } from "next/cache";
import { getServerSession } from "next-auth/next";
import { NextPage } from "next";
import { notFound } from "next/navigation";

import { authOptions } from "@lib/auth";
import { getAllPredictionData } from "@lib/game-functions";
import { allSeasonData } from "@data/formula-1/season-data";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { EntrantPredictions } from "@components/stats/entrant-predictions/entrant-predictions";
import { FeedbackContainer } from "@components/feedback-container/feedback-container";
import { PromptPredictions } from "@components/submit-predictions/prompt-predictions";
import { HeadToHeads } from "@components/stats/entrant-predictions/head-to-heads";
import { EntrantAccuracy } from "@components/stats/entrant-predictions/entrant-accuracy";

import styles from "@components/stats/stats.module.scss";

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
    /**@todo URGENT Check data is no longer getting messed up by old cache */
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
              show on this page for each of the drivers and teams.
            </p>
            <PromptPredictions
              isSignedIn={Boolean(currentUserDisplayName)}
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
              <EntrantAccuracy
                rounds={JSON.parse(JSON.stringify(predictionData.rounds))}
                isSeasonOver={isSeasonOver}
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
