import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";

const Page = () => {
  return (
    <>
      <PanelHeading>
        <h1>Formula 1 - Leaderboards</h1>
      </PanelHeading>
      <Panel>
        <p>
          Leaderboard page for the selected season. Clicking on the name of a
          player takes you to their standings page.
        </p>
      </Panel>
    </>
  );
};

export default Page;
