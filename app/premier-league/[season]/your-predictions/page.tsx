import { NextPage } from "next";
import { redirect, notFound } from "next/navigation";
import { generateOgImgUrl } from "@lib/misc";

import { auth } from "@lib/auth";
import { allPlSeasonData } from "@data/premier-league/season-data";

import { PanelHeading } from "@components/panels/panel-heading";
import { YourPredictions } from "@components/your-predictions/your-predictions";

import { PageProps } from "@custom-types/misc";

export const generateMetadata = async ({ params }: PageProps) => ({
  title: `Your PL ${params.season} Predictions | Predict The Standings`,
  description: `View your predictions for the ${params.season} Premier League season`,
  openGraph: {
    images: [
      {
        url: generateOgImgUrl(
          `Your PL ${params.season} Predictions`,
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
  const displayName = session?.user.displayName;
  if (session == null) {
    return redirect("/login?error=login");
  } else if (!displayName) {
    return redirect("/profile");
  }

  return (
    <>
      <PanelHeading
        align="center"
        mainHeading="Your Predictions"
        secondaryHeading={`${seasonData.competitionStrs.display} ${season}`}
      />
      <YourPredictions currUser={session.user} seasonData={seasonData} />
    </>
  );
};

export default Page;
