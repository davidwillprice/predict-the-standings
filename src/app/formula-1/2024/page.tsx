import { Panel } from "@ui/panel";
import { PanelHeading } from "@ui/panel-heading";

const Page = () => {
  return (
    <>
      <PanelHeading>
        <h1>Formula 1 - 2024</h1>
      </PanelHeading>
      <Panel>
        <p>
          This page could work as an 'About' but also be a dashboard for the
          2024 season.
        </p>
      </Panel>
    </>
  );
};

export default Page;
