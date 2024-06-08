export const runtime = "edge";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { NextPage } from "next";
import { notFound } from "next/navigation";

import { auth } from "@lib/auth";
import { allPlSeasonData } from "@data/premier-league/season-data";

import { PanelHeading } from "@components/panels/panel-heading";
import { YourPredictions } from "@components/your-predictions/your-predictions";

import { PageProps } from "@custom-types/misc";

export const metadata: Metadata = {
  title: "View Your Premier League Predictions | Predict The Standings",
};

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
    return redirect("/get-started");
  }

  return (
    <>
      <PanelHeading align="center">
        <h1>
          {seasonData.competitionStrs.display} {season} - Your Predictions
        </h1>
      </PanelHeading>
      <YourPredictions currUser={session.user} seasonData={seasonData} />
    </>
  );
};

export default Page;
