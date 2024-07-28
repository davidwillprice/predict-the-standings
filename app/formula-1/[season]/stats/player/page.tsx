import { NextPage } from "next";
import { notFound } from "next/navigation";
import { auth } from "@lib/auth";
import { generateOgImgUrl } from "@lib/misc";

import { allF1SeasonData } from "@data/formula-1/season-data";

import { PanelHeading } from "@components/panels/panel-heading";
import { PlayerStats } from "@components/stats/player/player-stats-container";

import { PageProps } from "@custom-types/misc";

export const generateMetadata = async ({ params }: PageProps) => {
  return {
    title: `Formula 1 ${params.season} Player Stats | Predict The Standings`,
    description: `View player stats and trivia for the ${params.season} Formula 1 season`,
    openGraph: {
      images: [
        {
          url: generateOgImgUrl(
            `Formula 1 ${params.season} | Player Stats`,
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

const Page: NextPage<PageProps> = async ({ params }) => {
  const { season } = params;
  const seasonData = allF1SeasonData.find(
    (seasonData) => seasonData.id === season
  );
  if (seasonData === undefined) notFound();

  const session = await auth();
  const currUser = session?.user;

  return (
    <>
      <PanelHeading
        mainHeading="Player Stats"
        secondaryHeading={`${seasonData.competitionStrs.display} ${season}`}
      />
      <PlayerStats
        currUser={currUser}
        preseasonText={
          "Once the first race of the season completes, various player stats will show on this page."
        }
        seasonData={seasonData}
      />
    </>
  );
};

export default Page;
