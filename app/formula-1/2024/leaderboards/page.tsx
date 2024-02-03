import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";

const Page = () => {
  return (
    <>
      <PanelHeading>
        <h1>Formula 1 - Leaderboards</h1>
      </PanelHeading>
      <Panel>
        <p>Leaderboard page for the upcoming/current season.</p>
      </Panel>
    </>
  );
};

export default Page;
