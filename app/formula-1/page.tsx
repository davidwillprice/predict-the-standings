import Link from "next/link";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { Button } from "@ui/button";

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
        <Link href="/formula-1/predict">
          <Button>Predict</Button>
        </Link>
      </Panel>
    </>
  );
};

export default Page;
