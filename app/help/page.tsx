import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";

const Page = () => {
  return (
    <>
      <PanelHeading>
        <h1>Help</h1>
      </PanelHeading>
      <Panel>
        <p>
          Help and rules page for both sports. With an example table where each
          row is listed &apos;Entrant 1&apos;, &apos;Entrant 2&apos; etc to keep
          it general between multiple sports.
        </p>
      </Panel>
    </>
  );
};

export default Page;
