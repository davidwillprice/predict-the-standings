import { Metadata } from "next";
import { redirect } from "next/navigation";
import { NextPage } from "next";
import { notFound } from "next/navigation";

import { auth } from "@lib/auth";
import { allF1SeasonData } from "@data/formula-1/season-data";

import { PanelHeading } from "@components/panels/panel-heading";
import { YourPredictions } from "@components/your-predictions/your-predictions";

import { PageProps } from "@custom-types/misc";

export const metadata: Metadata = {
  title: "View Your Formula 1 Predictions | Predict The Standings",
};

const Page: NextPage<PageProps> = async ({ params }) => {
  const { season } = params;
  const seasonData = allF1SeasonData.find(
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
