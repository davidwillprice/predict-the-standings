import { unstable_cache } from "next/cache";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { getAllPredictonData } from "@lib/game-functions";

import { rounds, entrants } from "@data/formula-1/2024";

import { Sport } from "@custom-types/misc";

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
  let predictionData;
  try {
    predictionData = await getCachedPredictionData();
  } catch (_) {
    console.log("Error");
  }
  return (
    <>
      <PanelHeading>
        <h1>Formula 1 - Table</h1>
      </PanelHeading>
      <Panel>
        <p>{predictionData ? JSON.stringify(predictionData, null, 2) : ""}</p>
        <p>
          Shows the selected user&apos;s table compared to the standings using
          url query, defaults to logged in user&apos;s table.
        </p>
      </Panel>
    </>
  );
};

export default Page;
