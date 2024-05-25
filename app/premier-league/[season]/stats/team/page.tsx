import { getServerSession } from "next-auth/next";
import { NextPage } from "next";
import { notFound } from "next/navigation";

import { authOptions } from "@lib/auth";
import { allPlSeasonData } from "@data/premier-league/season-data";
import { PanelHeading } from "@components/panels/panel-heading";

import { PageProps } from "@custom-types/misc";
import { EntrantStats } from "@components/stats/entrant-predictions/entrant-stats-container";

export async function generateStaticParams() {
  return Object.keys(allPlSeasonData).map((season) => ({
    season: season,
  }));
}

const Page: NextPage<PageProps> = async ({ params }) => {
  const { season } = params;
  const seasonData = allPlSeasonData.find(
    (seasonData) => seasonData.id === season
  );
  if (seasonData === undefined) notFound();

  const session = await getServerSession(authOptions);
  const isSignedIn = Boolean(session?.user.displayName);

  return (
    <>
      <PanelHeading>
        <h1>Premier League {season} - Team Stats</h1>
      </PanelHeading>
      <EntrantStats
        isSignedIn={isSignedIn}
        preseasonText={
          "Once the first gameweek of the season completes, various stats will show on this page for each team"
        }
        seasonData={seasonData}
      />
    </>
  );
};

export default Page;
