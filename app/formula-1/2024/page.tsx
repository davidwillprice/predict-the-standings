import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { getAllPredictonData } from "@lib/game-functions";

const season = "2024";
const sport = "f1";

export const revalidate = 3600;

const Page = async () => {
  let predictionData;
  try {
    predictionData = await getAllPredictonData(season, sport);
    console.log(predictionData);
  } catch (_) {
    console.log("Error");
  }
  return (
    <>
      <PanelHeading>
        <h1>Formula 1 - Leaderboards</h1>
      </PanelHeading>
      <Panel>
        <p>{predictionData ? predictionData[2].display_name : ""}</p>
        <p>
          Leaderboard page for the selected season. Clicking on the name of a
          player takes you to their standings page.
        </p>
      </Panel>
    </>
  );
};

export default Page;
