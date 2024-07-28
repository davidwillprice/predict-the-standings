import { NextPage } from "next";
import { notFound } from "next/navigation";
import { generateOgImgUrl } from "@lib/misc";

import { auth } from "@lib/auth";
import { allPlSeasonData } from "@data/premier-league/season-data";

import { PageProps } from "@custom-types/misc";
import { LeaderboardContainer } from "@components/game/leaderboard-container";

export const generateMetadata = async ({ params }: PageProps) => {
  return {
    title: `Premier League ${params.season} - Leaderboard | Predict The Standings`,
    description: `Leaderboard for the ${params.season} Premier League season`,
    openGraph: {
      images: [
        {
          url: generateOgImgUrl(
            `Premier League ${params.season} | Leaderboard`,
            "premier-league"
          ),
          alt: "Page screenshot",
        },
      ],
    },
  };
};

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
      headingText={`Premier League ${season}`}
      preseasonText={`Once the first gameweek of the season completes, the leaderboard will show here and you'll be able to compare how well everyone predicted the results.`}
      searchParams={searchParams}
      seasonData={seasonData}
    />
  );
};

export default Page;
