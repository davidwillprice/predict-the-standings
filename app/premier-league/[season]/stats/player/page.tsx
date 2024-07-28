import { NextPage } from "next";
import { notFound } from "next/navigation";
import { generateOgImgUrl } from "@lib/misc";
import { auth } from "@lib/auth";

import { allPlSeasonData } from "@data/premier-league/season-data";

import { PanelHeading } from "@components/panels/panel-heading";
import { PlayerStats } from "@components/stats/player/player-stats-container";

import { PageProps } from "@custom-types/misc";

export async function generateStaticParams() {
  return Object.keys(allPlSeasonData).map((season) => ({
    season: season,
  }));
}

export const generateMetadata = async ({ params }: PageProps) => ({
  title: `PL ${params.season} Player Stats | Predict The Standings`,
  description: `View player stats and trivia for the ${params.season} Premier League season`,
  openGraph: {
    images: [
      {
        url: generateOgImgUrl(
          `PL ${params.season} | Player Stats`,
          "premier-league"
        ),
        alt: "Page screenshot",
      },
    ],
  },
});

const Page: NextPage<PageProps> = async ({ params }) => {
  const { season } = params;
  const seasonData = allPlSeasonData.find(
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
          "Once the first gameweek of the season completes, various player stats will show on this page."
        }
        seasonData={seasonData}
      />
    </>
  );
};

export default Page;
