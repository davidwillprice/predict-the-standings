import { NextPage } from "next";
import { notFound } from "next/navigation";
import { auth } from "@lib/auth";
import { generateOgImgUrl } from "@lib/misc";

import { allEurovisionSeasonData } from "@data/eurovision/season-data";

import { PageProps } from "@custom-types/misc";
import { LeaderboardContainer } from "@components/game/leaderboard-container";

export const generateMetadata = async ({ params }: PageProps) => {
  return {
    title: `Eurovision ${params.season} - Leaderboard | Predict The Standings`,
    description: `Leaderboard for Eurovision ${params.season}`,
    openGraph: {
      images: [
        {
          url: generateOgImgUrl(
            `Eurovision ${params.season} | Leaderboard`,
            "eurovision"
          ),
          alt: "Page screenshot",
        },
      ],
    },
  };
};

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

  const session = await auth();
  const currUser = session?.user;

  return (
    <LeaderboardContainer
      currUser={currUser}
      headingText={`Eurovision ${season} Grand Final`}
      preseasonText={`Once Eurovision ${season} is over, the leaderboard will show here and you'll be able to compare how well everyone predicted the results.`}
      searchParams={searchParams}
      seasonData={seasonData}
    />
  );
};

export default Page;
