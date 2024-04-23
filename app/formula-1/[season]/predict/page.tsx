import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { NextPage } from "next";
import { notFound } from "next/navigation";

import { sortEntrantsAlphabetically } from "@lib/misc";
import { getSingleUserPredictionDataQuery } from "@lib/db-functions";
import { authOptions } from "@lib/auth";
import { allSeasonData } from "@data/formula-1/season-data";

import { Panel } from "@components/panels/panel";
import { EditPredictions } from "@components/submit-predictions/edit-predictions";
import { Countdown } from "@components/countdown/countdown";

import commonStyles from "@styles/common.module.scss";

import { PageProps } from "@custom-types/misc";
import { Entrant } from "@custom-types/game-types";

export const metadata: Metadata = {
  title: "Make Your Predictions | Predict The Standings",
};

const Page: NextPage<PageProps> = async ({ params }) => {
  const { season } = params;
  if (allSeasonData[season] === undefined) notFound();
  const session = await getServerSession(authOptions);
  const displayName = session?.user.displayName;
  if (session == null) {
    return redirect("/login?error=login");
  } else if (!displayName) {
    return redirect("/get-started");
  }

  const { predictionFreezeTime, drivers, teams } = allSeasonData[season];
  const userId = session.user.id;

  /**Create alphabetically ordered array of entrants to use as defaults if the user hasn't made predictions before */
  let defaultDriverArr = [];
  let defaultTeamArr = [];
  for (const driver of Object.values(drivers)) {
    defaultDriverArr.push(driver);
  }
  for (const team of Object.values(teams)) {
    defaultTeamArr.push(team);
  }
  defaultDriverArr = sortEntrantsAlphabetically(defaultDriverArr);
  defaultTeamArr = sortEntrantsAlphabetically(defaultTeamArr);

  let driverArr: Entrant[];
  let teamArr: Entrant[];
  try {
    const userPredictionData = await getSingleUserPredictionDataQuery(
      season,
      "f1",
      userId
    );
    /**Check if there is existing drivers predictions, and if not use an alphabetically ordered array of drivers */
    if (userPredictionData.predictions.driver) {
      driverArr = userPredictionData.predictions.driver.map(
        (entrantStr: string) => drivers[entrantStr]
      );
    } else {
      driverArr = defaultDriverArr;
    }
    /**Check if there is existing teams predictions, and if not use an alphabetically ordered array of teams */
    if (userPredictionData.predictions.team) {
      teamArr = userPredictionData.predictions.team.map(
        (entrantStr: string) => teams[entrantStr]
      );
    } else {
      teamArr = defaultTeamArr;
    }
  } catch (_) {
    driverArr = defaultDriverArr;
    teamArr = defaultTeamArr;
  }

  return (
    <>
      {predictionFreezeTime.getTime() > new Date().getTime() ? (
        <EditPredictions
          displayName={displayName}
          initialDrivers={JSON.parse(JSON.stringify(driverArr))}
          initialTeams={JSON.parse(JSON.stringify(teamArr))}
          predictionFreezeTime={predictionFreezeTime}
          season={season}
          sport={"f1"}
          userId={userId}>
          <Panel>
            <p>
              Drag the drivers and teams into the order which you think they
              will be in at the end of the&nbsp;season.
            </p>
            <p>
              Any new drivers entering the season midway through won&apos;t be
              included in the final standings.
            </p>
          </Panel>
          <Panel>
            <p>
              Predictions will lock at the start of opening weekend&apos;s Free
              Practice 1. You can edit your predictions up until{" "}
              {predictionFreezeTime.toDateString() +
                " " +
                predictionFreezeTime.toTimeString()}
              .
            </p>
            <Countdown deadline={predictionFreezeTime} />
          </Panel>
          <div
            id="submit-predictions-con"
            className={commonStyles.anchor}></div>
        </EditPredictions>
      ) : (
        <Panel>
          <p className={commonStyles.text_center}>
            The {season} season has started and predictions are frozen!
          </p>
        </Panel>
      )}
    </>
  );
};

export default Page;
