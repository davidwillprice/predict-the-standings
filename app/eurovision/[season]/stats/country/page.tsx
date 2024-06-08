export const runtime = "edge";
import { NextPage } from "next";
import { notFound } from "next/navigation";
import { auth } from "@lib/auth";

import { allEurovisionSeasonData } from "@data/eurovision/season-data";
import { PanelHeading } from "@components/panels/panel-heading";

import { PageProps } from "@custom-types/misc";
import { EntrantStats } from "@components/stats/entrant-predictions/entrant-stats-container";

export async function generateStaticParams() {
  return Object.keys(allEurovisionSeasonData).map((season) => ({
    season: season,
  }));
}

const Page: NextPage<PageProps> = async ({ params }) => {
  const { season } = params;
  const seasonData = allEurovisionSeasonData.find(
    (seasonData) => seasonData.id === season
  );
  if (seasonData === undefined) notFound();

  const session = await auth();
  const currUser = session?.user;

  return (
    <>
      <PanelHeading>
        <h1>Eurovision {season} Grand Final - Country Stats</h1>
      </PanelHeading>
      <EntrantStats
        currUser={currUser}
        preseasonText={`Once Eurovision ${season} is over, various stats will show on this page for each of the countries.`}
        seasonData={seasonData}
      />
    </>
  );
};

export default Page;
