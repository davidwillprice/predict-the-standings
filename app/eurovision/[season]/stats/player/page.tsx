import { NextPage } from "next";
import { notFound } from "next/navigation";
import { generateOgImgUrl } from "@lib/misc";

import { auth } from "@lib/auth";
import { allEurovisionSeasonData } from "@data/eurovision/season-data";

import { PanelHeading } from "@components/panels/panel-heading";
import { PlayerStats } from "@components/stats/player/player-stats-container";

import { PageProps } from "@custom-types/misc";

export async function generateStaticParams() {
  return Object.keys(allEurovisionSeasonData).map((season) => ({
    season: season,
  }));
}

export const generateMetadata = async ({ params }: PageProps) => {
  return {
    title: `Eurovision ${params.season} Player Stats | Predict The Standings`,
    description: `View player stats and trivia for the Eurovision ${params.season} Grand Final`,
    openGraph: {
      images: [
        {
          url: generateOgImgUrl(
            `Eurovision ${params.season} | Player Stats`,
            "eurovision"
          ),
          alt: "Page screenshot",
        },
      ],
    },
  };
};

const Page: NextPage<PageProps> = async ({ params }) => {
  const { season } = params;

  const seasonData = allEurovisionSeasonData.find(
    (seasonData) => seasonData.id === season
  );
  if (seasonData === undefined) notFound();

  const session = await auth();
  const currUser = session?.user;

  return (
    <>
      <PanelHeading
        mainHeading="Player Stats"
        secondaryHeading={`Eurovision ${season} Grand Final`}
      />
      <PlayerStats
        currUser={currUser}
        preseasonText={`Once Eurovision ${season} is over, various player stats will show on this page.`}
        seasonData={seasonData}
      />
    </>
  );
};

export default Page;
