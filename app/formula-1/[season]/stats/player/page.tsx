import { getServerSession } from "next-auth/next";
import { NextPage } from "next";
import { notFound } from "next/navigation";

import { authOptions } from "@lib/auth";
import { allF1SeasonData } from "@data/formula-1/season-data";

import { PanelHeading } from "@components/panels/panel-heading";
import { PlayerStats } from "@components/stats/player/player-stats-container";

import { PageProps } from "@custom-types/misc";

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
  const currUserId = session?.user.id;

  return (
    <>
      <PanelHeading>
        <h1>Formula 1 {season} - Player Stats</h1>
      </PanelHeading>
      <PlayerStats
        currUserId={currUserId}
        preseasonText={
          "Once the first race of the season completes, various player stats will show on this page."
        }
        seasonData={seasonData}
      />
    </>
  );
};

export default Page;
