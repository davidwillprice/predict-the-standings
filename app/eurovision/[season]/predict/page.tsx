import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { NextPage } from "next";
import { notFound } from "next/navigation";

import { getUserGameDataQuery } from "@lib/db-functions";
import { authOptions } from "@lib/auth";
import { allEurovisionSeasonData } from "@data/eurovision/season-data";

import { CompetitionNavLinks } from "@components/latest-season-showcase/comp-nav-links";
import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { EditPredictions } from "@components/submit-predictions/edit-predictions";

import commonStyles from "@styles/common.module.scss";

import { PageProps, CompetitionLink } from "@custom-types/misc";
import { Entrant } from "@custom-types/game-types";
import { getSpecificGameDataIdFromSessionUser } from "@lib/misc";

export const metadata: Metadata = {
  title: "Make Your Eurovision Predictions | Predict The Standings",
};

const Page: NextPage<PageProps> = async ({ params }) => {
  const { season } = params;
  const seasonData = allEurovisionSeasonData.find(
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
    predictionsOpen,
    isSeasonOver,
    startingEntrantOrders,
  } = seasonData;
  const { countries } = seasonData.allEntrants;
  const userId = session.user.id;

  let defaultCountryArr;
  if (startingEntrantOrders) {
    defaultCountryArr = startingEntrantOrders.countries.map(
      (countrySName) => countries[countrySName]
    );
  } else {
    throw new Error("Can't find performance order of countries");
  }

  let countryArr: Entrant[];
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
    countryArr = userPredictionData.predictions.countries.map(
      (entrantStr: string) => countries[entrantStr]
    );
  } catch (_) {
    /**If there is no existing predictions, use the default*/
    countryArr = defaultCountryArr;
  }

  return (
    <>
      {!predictionsOpen ? (
        <>
          <PanelHeading>
            <h1>
              Predict The {competitionStrs.display} {season} Grand Final -
              Standings
            </h1>
          </PanelHeading>
          <Panel>
            <p>
              Please return once the countries competing in the{" "}
              {competitionStrs.display} {season} Grand Final have been
              confirmed.
            </p>
          </Panel>
        </>
      ) : !arePredictionsFrozen ? (
        <EditPredictions
          arePredictionsFrozen={arePredictionsFrozen}
          displayName={displayName}
          entrantType={"countries"}
          initialEntrants={JSON.parse(JSON.stringify(countryArr))}
          season={season}
          seasonData={JSON.parse(JSON.stringify(seasonData))}
          userId={userId}>
          <Panel>
            <p>
              Drag the countries into the order which you think they will finish
              in.
            </p>
            <p>
              Predictions will lock when the voting results start being
              announced.
            </p>
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
                  new CompetitionLink("", "microphone", "Leaderboard"),
                  new CompetitionLink(
                    "stats/country",
                    "stats",
                    "Country Stats"
                  ),
                  new CompetitionLink("stats/player", "group", "Player Stats"),
                ]}
                localSeasonData={seasonData}
                showHelp={false}
              />
            </>
          ) : (
            <p className={commonStyles.text_center}>
              The results are being announced and so predictions are frozen!
            </p>
          )}
        </Panel>
      )}
    </>
  );
};

export default Page;
