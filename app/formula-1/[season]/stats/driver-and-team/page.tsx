import { getServerSession } from "next-auth/next";
import { NextPage } from "next";
import { notFound } from "next/navigation";

import { authOptions } from "@lib/auth";
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

  const session = await getServerSession(authOptions);
  const isSignedIn = Boolean(session?.user.displayName);

  return (
    <>
      <PanelHeading>
        <h1>Formula 1 {season} - Driver & Team Stats</h1>
      </PanelHeading>
      <EntrantStats
        isSignedIn={isSignedIn}
        preseasonText={
          "Once the first race of the season completes, various stats will show on this page for each of the drivers and teams"
        }
        seasonData={seasonData}
      />
    </>
  );
};

export default Page;
