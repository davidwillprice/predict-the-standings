import { NextPage } from "next";
import { notFound } from "next/navigation";
import { auth } from "@lib/auth";
import { generateOgImgUrl } from "@lib/misc";

import { allEurovisionSeasonData } from "@data/eurovision/season-data";
import { PanelHeading } from "@components/panels/panel-heading";

import { PageProps } from "@custom-types/misc";
import { EntrantStats } from "@components/stats/entrant-predictions/entrant-stats-container";

export const generateMetadata = async ({ params }: PageProps) => {
  return {
    title: `Eurovision ${params.season} Country Stats | Predict The Standings`,
    description: `View country stats and trivia for the Eurovision ${params.season} Grand Final`,
    openGraph: {
      images: [
        {
          url: generateOgImgUrl(
            `Eurovision ${params.season} | Country Stats`,
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
        mainHeading="Country Stats"
        secondaryHeading={`Eurovision ${season} Grand Final`}
      />
      <EntrantStats
        currUser={currUser}
        preseasonText={`Once Eurovision ${season} is over, various stats will show on this page for each of the countries.`}
        seasonData={seasonData}
      />
    </>
  );
};

export default Page;
