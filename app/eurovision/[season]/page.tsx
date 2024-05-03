import { NextPage } from "next";
import { getServerSession } from "next-auth/next";
import { notFound } from "next/navigation";

import { authOptions } from "@lib/auth";
import { allEurovisionSeasonData } from "@data/eurovision/season-data";

import { PageProps } from "@custom-types/misc";
import { LeaderboardContainer } from "@components/game/leaderboard-container";

export async function generateStaticParams() {
  return Object.keys(allEurovisionSeasonData).map((season) => ({
    season: season,
  }));
}

const Page: NextPage<PageProps> = async ({ params, searchParams }) => {
  const { season } = params;

  const seasonData = allEurovisionSeasonData.find(
    (seasonData) => seasonData.id === season
  );
  if (seasonData === undefined) notFound();

  const session = await getServerSession(authOptions);
  const currUser = session?.user;

  return (
    <LeaderboardContainer
      currUser={currUser}
      headingText={`Eurovision ${season} - Leaderboard`}
      preseasonText={`Once Eurovision ${season} is over, the leaderboard will show hereand you&apos;ll be able to compare how well everyone predicted the results.`}
      searchParams={searchParams}
      seasonData={seasonData}
    />
  );
};

export default Page;
