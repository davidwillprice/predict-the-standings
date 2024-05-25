import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { NextPage } from "next";
import { notFound } from "next/navigation";

import { authOptions } from "@lib/auth";
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

  const session = await getServerSession(authOptions);
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
      <YourPredictions seasonData={seasonData} userId={session.user.id} />
    </>
  );
};

export default Page;
