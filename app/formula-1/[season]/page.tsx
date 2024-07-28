import { NextPage } from "next";
import { auth } from "@lib/auth";
import { notFound } from "next/navigation";
import { generateOgImgUrl } from "@lib/misc";

import { allF1SeasonData } from "@data/formula-1/season-data";

import { LeaderboardContainer } from "@components/game/leaderboard-container";

import { PageProps } from "@custom-types/misc";

export const generateMetadata = async ({ params }: PageProps) => {
  return {
    title: `Formula 1 ${params.season} - Leaderboard | Predict The Standings`,
    description: `Leaderboard for the ${params.season} Formula 1 season`,
    openGraph: {
      images: [
        {
          url: generateOgImgUrl(
            `Formula 1 ${params.season} | Leaderboard`,
            "f1"
          ),
          alt: "Page screenshot",
        },
      ],
    },
  };
};

export async function generateStaticParams() {
  return Object.keys(allF1SeasonData).map((season) => ({
    season: season,
  }));
}

const Page: NextPage<PageProps> = async ({ params, searchParams }) => {
  const { season } = params;
  const seasonData = allF1SeasonData.find(
    (seasonData) => seasonData.id === season
  );
  if (seasonData === undefined) notFound();

  const session = await auth();
  const currUser = session?.user;

  const entrantTypeStr =
    searchParams.leaderboard === "constructors" ? "Constructors" : "Drivers";
  return (
    <LeaderboardContainer
      currUser={currUser}
      headingText={`Formula 1 ${season}`}
      preseasonText={`Once the first race of the season completes, the ${entrantTypeStr} leaderboard will show here and you'll be able to track everyone's performance as the season progresses.`}
      searchParams={searchParams}
      seasonData={seasonData}
    />
  );
};

export default Page;
