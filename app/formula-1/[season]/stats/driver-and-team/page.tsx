import { NextPage } from "next";
import { notFound } from "next/navigation";
import { auth } from "@lib/auth";

import { allF1SeasonData } from "@data/formula-1/season-data";
import { PanelHeading } from "@components/panels/panel-heading";

import { PageProps } from "@custom-types/misc";
import { EntrantStats } from "@components/stats/entrant-predictions/entrant-stats-container";

export async function generateStaticParams() {
  return Object.keys(allF1SeasonData).map((season) => ({
    season: season,
  }));
}

const Page: NextPage<PageProps> = async ({ params }) => {
  const { season } = params;
  const seasonData = allF1SeasonData.find(
    (seasonData) => seasonData.id === season
  );
  if (seasonData === undefined) notFound();

  const session = await auth();
  const currUser = session?.user;

  return (
    <>
      <PanelHeading
        mainHeading="Driver & Team Stats"
        secondaryHeading={`${seasonData.competitionStrs.display} ${season}`}
      />
      <EntrantStats
        currUser={currUser}
        preseasonText={
          "Once the first race of the season completes, various stats will show on this page for each of the drivers and teams"
        }
        seasonData={seasonData}
      />
    </>
  );
};

export default Page;
