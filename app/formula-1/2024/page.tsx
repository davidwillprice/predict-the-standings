import { unstable_cache } from "next/cache";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { getAllPredictonData } from "@lib/game-functions";

import { Sport } from "@custom-types/misc";

const season = "2024";
const sport: Sport = "f1";

const getCachedPredictionData = unstable_cache(
  async () => {
    try {
      return await getAllPredictonData(season, sport);
    } catch (_) {
      console.log("Failed to getAllPredictonData()");
    }
  },
  [season, sport],
  { revalidate: 60 }
);

const Page = async () => {
  let predictionData;
  try {
    predictionData = await getCachedPredictionData();
    //console.log(predictionData);
  } catch (_) {
    //console.log("Error");
  }
  return (
    <>
      <PanelHeading>
        <h1>Formula 1 - Leaderboards</h1>
      </PanelHeading>
      <Panel>
        <p>{predictionData ? JSON.stringify(predictionData, null, 2) : ""}</p>
        <p>
          Leaderboard page for the selected season. Clicking on the name of a
          player takes you to their standings page.
        </p>
      </Panel>
    </>
  );
};

export default Page;
