import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { sortEntrantsAlphabetically } from "@lib/misc";
import { getF1PredictionTablesQuery } from "@lib/db-functions";
import { authOptions } from "@lib/auth";
import { allSeasonData } from "@data/formula-1/season-data";

import { Panel } from "@components/panels/panel";
import { EditPredictions } from "@components/submit-predictions/edit-predictions";
import { Countdown } from "@components/countdown/countdown";

import commonStyles from "@styles/common.module.scss";

import { Entrant } from "@custom-types/game-types";
import { Sport } from "@custom-types/misc";

export const metadata: Metadata = {
  title: "Make Your Predictions | Predict The Standings",
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (session == null) {
    return redirect("/login?error=login");
  } else if (!session?.user.displayName) {
    return redirect("/get-started");
  }

  const { predictionFreezeTime, drivers, teams } = allSeasonData["2024"];
  const userId = session.user.id;
  const sport: Sport = "f1";
  const season = "2024";

  const defaultDriverArr = sortEntrantsAlphabetically([
    drivers.ham,
    drivers.bot,
    drivers.lec,
    drivers.sai,
    drivers.ver,
    drivers.per,
    drivers.alo,
    drivers.oco,
    drivers.hul,
    drivers.mag,
    drivers.nor,
    drivers.pia,
    drivers.ric,
    drivers.str,
    drivers.zho,
    drivers.alb,
    drivers.tsu,
    drivers.gas,
    drivers.sar,
    drivers.rus,
  ]);
  const defaultTeamArr = sortEntrantsAlphabetically([
    teams.mer,
    teams.fer,
    teams.red,
    teams.mcl,
    teams.alp,
    teams.rb,
    teams.ast,
    teams.has,
    teams.sau,
    teams.wil,
  ]);
  let driverArr: Entrant[];
  let teamArr: Entrant[];
  try {
    const tablesQueryRow = await getF1PredictionTablesQuery(
      season,
      sport,
      userId
    );
    if (!tablesQueryRow) {
      throw new Error();
    }
    /**Check if there is existing drivers predictions, and if not use an alphabetically ordered array of drivers */
    if (tablesQueryRow["driver_predictions"]) {
      driverArr = tablesQueryRow["driver_predictions"].map(
        (entrantStr: string) => drivers[entrantStr]
      );
    } else {
      driverArr = defaultDriverArr;
    }
    /**Check if there is existing teams predictions, and if not use an alphabetically ordered array of teams */
    if (tablesQueryRow["team_predictions"] !== null) {
      teamArr = tablesQueryRow["team_predictions"].map(
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
          initialDrivers={JSON.parse(JSON.stringify(driverArr))}
          initialTeams={JSON.parse(JSON.stringify(teamArr))}
          predictionFreezeTime={predictionFreezeTime}
          season={season}
          sport={sport}
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
}
