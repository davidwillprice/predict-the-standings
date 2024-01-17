import { Panel } from "@ui/panel";
import { PanelHeading } from "@ui/panel-heading";

const Page = () => {
  return (
    <>
      <PanelHeading>
        <h1>Help</h1>
      </PanelHeading>
      <Panel>
        <p>
          Help and rules page for both sports. With an example table where each
          row is listed 'Entrant 1', 'Entrant 2' etc to keep it general between
          multiple sports.
        </p>
      </Panel>
    </>
  );
};

export default Page;
