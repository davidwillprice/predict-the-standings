import { unstable_cache } from "next/cache";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@lib/auth";
import { getAllPredictonData } from "@lib/game-functions";
import { rounds, entrants } from "@data/formula-1/2024";

import { PanelHeading } from "@components/panels/panel-heading";
import { LeaderboardContainer } from "@components/leaderboards/leaderboard-container";

import { Sport } from "@custom-types/misc";
import { PredictionData } from "@custom-types/game-types";

const season = "2024";
const sport: Sport = "f1";

const getCachedPredictionData = unstable_cache(
  async () => {
    try {
      return await getAllPredictonData(entrants, rounds, season, sport);
    } catch (_) {
      console.log("Failed to getAllPredictonData()");
    }
  },
  [season, sport],
  { revalidate: 60 }
);

const Page = async () => {
  const session = await getServerSession(authOptions);
  const currentUserDisplayName = session?.user.displayName;
  let predictionData: PredictionData | null | undefined;
  try {
    predictionData = await getCachedPredictionData();
  } catch (_) {
    //console.log("Error");
  }
  return (
    <>
      <PanelHeading>
        <h1>Formula 1 - Leaderboards</h1>
      </PanelHeading>
      {predictionData ? (
        <LeaderboardContainer
          currentUserDisplayName={currentUserDisplayName}
          rounds={JSON.parse(JSON.stringify(predictionData.rounds))}
          users={JSON.parse(JSON.stringify(predictionData.users))}
        />
      ) : (
        <p>Unable to obtain prediction data</p>
      )}
    </>
  );
};

export default Page;
