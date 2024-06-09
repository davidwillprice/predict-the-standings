import Link from "next/link";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { CompetitionButtons } from "@components/competition-buttons";

export default function NotFound() {
  return (
    <>
      <PanelHeading>
        <h1>Page Not Found</h1>
      </PanelHeading>
      <Panel>
        <p>Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
        <p>
          Return to the <Link href="/">homepage</Link> or visit one of the
          competitions below.
        </p>
        <CompetitionButtons />
      </Panel>
    </>
  );
}
