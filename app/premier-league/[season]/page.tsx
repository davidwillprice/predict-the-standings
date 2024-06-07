export const runtime = "edge";
import { NextPage } from "next";
import { notFound } from "next/navigation";

import { auth } from "@lib/auth";
import { allPlSeasonData } from "@data/premier-league/season-data";

import { PageProps } from "@custom-types/misc";
import { LeaderboardContainer } from "@components/game/leaderboard-container";

export async function generateStaticParams() {
  return Object.keys(allPlSeasonData).map((season) => ({
    season: season,
  }));
}

const Page: NextPage<PageProps> = async ({ params, searchParams }) => {
  const { season } = params;

  const seasonData = allPlSeasonData.find(
    (seasonData) => seasonData.id === season
  );
  if (seasonData === undefined) notFound();

  const session = await auth();
  const currUser = session?.user;

  return (
    <LeaderboardContainer
      currUser={currUser}
      headingText={`Premier League ${season} - Leaderboard`}
      preseasonText={`Once the first gameweek of the season completes, the leaderboard will show here and you'll be able to compare how well everyone predicted the results.`}
      searchParams={searchParams}
      seasonData={seasonData}
    />
  );
};

export default Page;
