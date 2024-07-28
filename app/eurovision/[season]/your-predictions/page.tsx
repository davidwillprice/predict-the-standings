import { Metadata } from "next";
import { redirect } from "next/navigation";
import { NextPage } from "next";
import { notFound } from "next/navigation";
import { generateOgImgUrl } from "@lib/misc";

import { auth } from "@lib/auth";
import { allEurovisionSeasonData } from "@data/eurovision/season-data";

import { PanelHeading } from "@components/panels/panel-heading";
import { YourPredictions } from "@components/your-predictions/your-predictions";

import { PageProps } from "@custom-types/misc";

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  return {
    title: `Your Eurovision ${params.season} Predictions | Predict The Standings`,
    description: `View your predictions for the Eurovision ${params.season} Grand Final`,
    openGraph: {
      images: [
        {
          url: generateOgImgUrl(
            `Your Eurovision ${params.season} Predictions`,
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
        secondaryHeading={`${seasonData.competitionStrs.display} ${season} Grand Final`}
      />
      <YourPredictions currUser={session.user} seasonData={seasonData} />
    </>
  );
};

export default Page;
