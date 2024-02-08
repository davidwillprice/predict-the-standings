import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";

const Page = () => {
  return (
    <>
      <PanelHeading>
        <h1>Formula 1 - Table</h1>
      </PanelHeading>
      <Panel>
        <p>
          Shows the selected user&apos;s table compared to the standings using
          url query, defaults to logged in user&apos;s table.
        </p>
      </Panel>
    </>
  );
};

export default Page;
