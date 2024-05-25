import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { NextPage } from "next";
import { notFound } from "next/navigation";

import { getSingleUserPredictionDataQuery } from "@lib/db-functions";
import { sortEntrantsAlphabetically } from "@lib/misc";
import { authOptions } from "@lib/auth";
import { allPlSeasonData } from "@data/premier-league/season-data";

import { Countdown } from "@components/countdown/countdown";
import { CompetitionNavLinks } from "@components/latest-season-showcase/comp-nav-links";
import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { EditPredictions } from "@components/submit-predictions/edit-predictions";

import commonStyles from "@styles/common.module.scss";

import { PageProps, CompetitionLink } from "@custom-types/misc";
import { Entrant } from "@custom-types/game-types";

export const metadata: Metadata = {
  title: "Submit Your Premier League Predictions | Predict The Standings",
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

  const {
    arePredictionsFrozen,
    competitionStrs,
    predictionFreezeDate,
    predictionsOpen,
    isSeasonOver,
  } = seasonData;
  const entrantType = "teams";
  const entrants = seasonData.allEntrants[entrantType];
  const userId = session.user.id;

  /**Create alphabetically ordered array of entrants to use as defaults if the user hasn't made predictions before */
  let defaultEntrantArr = [];
  for (const entrant of Object.values(entrants)) {
    defaultEntrantArr.push(entrant);
  }
  defaultEntrantArr = sortEntrantsAlphabetically(defaultEntrantArr);

  let entrantArr: Entrant[];
  try {
    const userPredictionData = await getSingleUserPredictionDataQuery(
      season,
      competitionStrs.shortHand,
      userId
    );

    /**Check if there is existing entrant predictions, and if not use the alphabetically ordered array instead */
    if (userPredictionData.predictions[entrantType]) {
      entrantArr = userPredictionData.predictions[entrantType].map(
        (entrantStr: string) => entrants[entrantStr]
      );
    } else {
      entrantArr = defaultEntrantArr;
    }
  } catch (_) {
    entrantArr = defaultEntrantArr;
  }

  return (
    <>
      {!predictionsOpen ? (
        <>
          <PanelHeading>
            <h1>
              Predict The {competitionStrs.display} {season}
              Standings
            </h1>
          </PanelHeading>
          <Panel>
            <p>
              Please return once the teams competing in the{" "}
              {competitionStrs.display} {season} season have been confirmed.
            </p>
          </Panel>
        </>
      ) : !arePredictionsFrozen ? (
        <EditPredictions
          arePredictionsFrozen={arePredictionsFrozen}
          displayName={displayName}
          entrantType={entrantType}
          initialEntrants={JSON.parse(JSON.stringify(entrantArr))}
          season={season}
          seasonData={JSON.parse(JSON.stringify(seasonData))}
          userId={userId}>
          <Panel>
            <p>
              Drag the teams into the order which you think they will finish in.
            </p>
            <p>
              Predictions will freeze once the first game of the season kicks
              off.
            </p>
            <Countdown deadline={predictionFreezeDate} />
          </Panel>
          <div
            id="submit-predictions-con"
            className={commonStyles.anchor}></div>
        </EditPredictions>
      ) : (
        /**@todo Show people's predictions if they have any saved */
        <Panel>
          {isSeasonOver ? (
            <>
              <p className={commonStyles.text_center}>
                {competitionStrs.display} {season} is over, but you can view its
                leaderboard and stats.
              </p>
              <CompetitionNavLinks
                linkArr={[
                  new CompetitionLink("", "premierLeague", "Leaderboard"),
                  new CompetitionLink("stats/team", "stats", "Team Stats"),
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
