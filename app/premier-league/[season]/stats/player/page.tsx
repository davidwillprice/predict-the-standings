import { getServerSession } from "next-auth/next";
import { NextPage } from "next";
import { notFound } from "next/navigation";

import { authOptions } from "@lib/auth";
import { allPlSeasonData } from "@data/premier-league/season-data";

import { PanelHeading } from "@components/panels/panel-heading";
import { PlayerStats } from "@components/stats/player/player-stats-container";

import { PageProps } from "@custom-types/misc";

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
  const currUser = session?.user;

  return (
    <>
      <PanelHeading>
        <h1>Premier League {season} - Player Stats</h1>
      </PanelHeading>
      <PlayerStats
        currUser={currUser}
        preseasonText={
          "Once the first gameweek of the season completes, various player stats will show on this page."
        }
        seasonData={seasonData}
      />
    </>
  );
};

export default Page;
