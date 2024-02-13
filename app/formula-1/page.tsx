import Link from "next/link";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { Button } from "@components/button/button";

const Page = () => {
  return (
    <>
      <PanelHeading>
        <h1>Formula 1 - Homepage</h1>
      </PanelHeading>
      <Panel>
        <p>
          {/**@todo URGENT Add text including F1 disclaimer */}
          {/**@todo URGENT Add leaderboard link, and hide prediction link if passed freeze */}
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
