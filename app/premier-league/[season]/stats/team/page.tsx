import { NextPage } from "next";
import { notFound } from "next/navigation";
import { generateOgImgUrl } from "@lib/misc";
import { auth } from "@lib/auth";

import { allPlSeasonData } from "@data/premier-league/season-data";
import { PanelHeading } from "@components/panels/panel-heading";

import { PageProps } from "@custom-types/misc";
import { EntrantStats } from "@components/stats/entrant-predictions/entrant-stats-container";

export async function generateStaticParams() {
  return Object.keys(allPlSeasonData).map((season) => ({
    season: season,
  }));
}

export const generateMetadata = async ({ params }: PageProps) => ({
  title: `PL ${params.season} Team Stats | Predict The Standings`,
  description: `View team stats and trivia for the ${params.season} Premier League season`,
  openGraph: {
    images: [
      {
        url: generateOgImgUrl(
          `PL ${params.season} | Team Stats`,
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
        mainHeading="Team Stats"
        secondaryHeading={`${seasonData.competitionStrs.display} ${season}`}
      />
      <EntrantStats
        currUser={currUser}
        preseasonText={
          "Once the first gameweek of the season completes, various stats will show on this page for each team."
        }
        seasonData={seasonData}
      />
    </>
  );
};

export default Page;
