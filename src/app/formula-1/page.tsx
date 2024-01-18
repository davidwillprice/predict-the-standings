import { Panel } from "@ui/panel";
import { PanelHeading } from "@ui/panel-heading";

const Page = () => {
  return (
    <>
      <PanelHeading>
        <h1>Formula 1 - Homepage</h1>
      </PanelHeading>
      <Panel>
        <p>
          This page could work as an &apos;About&apos; page but also lists each
          of the previous/current seasons.
        </p>
      </Panel>
    </>
  );
};

export default Page;
