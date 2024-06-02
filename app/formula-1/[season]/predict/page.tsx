import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { NextPage } from "next";
import { notFound } from "next/navigation";

import {
  getSpecificGameDataIdFromSessionUser,
  sortEntrantsAlphabetically,
} from "@lib/misc";
import { getUserGameDataQuery } from "@lib/db-functions";
import { authOptions } from "@lib/auth";
import { allF1SeasonData } from "@data/formula-1/season-data";

import { Panel } from "@components/panels/panel";
import { EditF1Predictions } from "@components/submit-predictions/edit-f1-predictions";
import { Countdown } from "@components/countdown/countdown";
import { CompetitionNavLinks } from "@components/latest-season-showcase/comp-nav-links";

import commonStyles from "@styles/common.module.scss";

import { PageProps, CompetitionLink } from "@custom-types/misc";
import { Entrant } from "@custom-types/game-types";

export const metadata: Metadata = {
  title: "Make Your Predictions | Predict The Standings",
};

const Page: NextPage<PageProps> = async ({ params }) => {
  const { season } = params;
  const seasonData = allF1SeasonData.find(
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

  const {
    arePredictionsFrozen,
    competitionStrs,
    isSeasonOver,
    predictionFreezeDate,
  } = seasonData;
  const { drivers, teams } = seasonData.allEntrants;
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
    const gameDataId: string | undefined = getSpecificGameDataIdFromSessionUser(
      season,
      competitionStrs.shortHand,
      session.user
    );
    if (!gameDataId) throw new Error();

    const userPredictionData = await getUserGameDataQuery(
      season,
      competitionStrs.shortHand,
      gameDataId
    );

    /**If their existing predictions have been successfully obtained, convert the array of ids to Entants */
    driverArr = userPredictionData.predictions.drivers.map(
      (entrantStr: string) => drivers[entrantStr]
    );
    teamArr = userPredictionData.predictions.teams.map(
      (entrantStr: string) => teams[entrantStr]
    );
  } catch (_) {
    /**If there is no existing predictions, use the default*/
    driverArr = defaultDriverArr;
    teamArr = defaultTeamArr;
  }

  return (
    <>
      {!arePredictionsFrozen ? (
        <EditF1Predictions
          arePredictionsFrozen={arePredictionsFrozen}
          displayName={displayName}
          initialDrivers={JSON.parse(JSON.stringify(driverArr))}
          initialTeams={JSON.parse(JSON.stringify(teamArr))}
          season={season}
          seasonData={JSON.parse(JSON.stringify(seasonData))}
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
              {predictionFreezeDate.toDateString() +
                " " +
                predictionFreezeDate.toTimeString()}
              .
            </p>
            <Countdown deadline={predictionFreezeDate} />
          </Panel>
          <div
            id="submit-predictions-con"
            className={commonStyles.anchor}></div>
        </EditF1Predictions>
      ) : (
        <Panel>
          {isSeasonOver ? (
            <>
              <p className={commonStyles.text_center}>
                The Formula 1 {season} season is over, but you can view its
                leaderboard and stats.
              </p>
              <CompetitionNavLinks
                linkArr={[
                  new CompetitionLink("", "driver", "Drivers Leaderboard"),
                  new CompetitionLink(
                    "?leaderboard=constructors",
                    "f1",
                    "Constructors Leaderboard"
                  ),
                  new CompetitionLink(
                    "stats/driver-and-team",
                    "stats",
                    "Driver & Team Stats"
                  ),
                  new CompetitionLink("stats/player", "group", "Player Stats"),
                ]}
                localSeasonData={seasonData}
                showHelp={false}
              />
            </>
          ) : (
            <p className={commonStyles.text_center}>
              The {season} season has started and predictions are frozen!
            </p>
          )}
        </Panel>
      )}
    </>
  );
};

export default Page;
