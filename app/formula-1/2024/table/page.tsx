import { unstable_cache } from "next/cache";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { getAllPredictonData } from "@lib/game-functions";

const season = "2024";
const sport = "f1";

const getCachedPredictionData = unstable_cache(
  async () => {
    try {
      return await getAllPredictonData(season, sport);
    } catch (_) {
      console.log("Error");
    }
  },
  [season, sport],
  { revalidate: 3600 }
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
        <p>{predictionData ? predictionData[2].displayName : ""}</p>
        <p>
          Shows the selected user&apos;s table compared to the standings using
          url query, defaults to logged in user&apos;s table.
        </p>
      </Panel>
    </>
  );
};

export default Page;
