import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { NextPage } from "next";
import { notFound } from "next/navigation";

import { sortEntrantsAlphabetically } from "@lib/misc";
import { getSingleUserPredictionDataQuery } from "@lib/db-functions";
import { authOptions } from "@lib/auth";
import { allEurovisionSeasonData } from "@data/eurovision/season-data";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { EditPredictions } from "@components/submit-predictions/edit-predictions";
import { Countdown } from "@components/countdown/countdown";

import commonStyles from "@styles/common.module.scss";

import { PageProps } from "@custom-types/misc";
import { Entrant } from "@custom-types/game-types";

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
    predictionFreezeTime,
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
    const userPredictionData = await getSingleUserPredictionDataQuery(
      season,
      "eurovision",
      userId
    );

    /**Check if user has made predictions previously, and if not use the performance order of the countries */
    if (userPredictionData.predictions.countries) {
      countryArr = userPredictionData.predictions.countries.map(
        (entrantStr: string) => countries[entrantStr]
      );
    } else {
      countryArr = defaultCountryArr;
    }
  } catch (_) {
    countryArr = defaultCountryArr;
  }

  return (
    <>
      {!predictionsOpen ? (
        <>
          <PanelHeading>
            <h1>Predict The Eurovision {season} Grand Final - Standings</h1>
          </PanelHeading>
          <Panel>
            <p>
              Please return once the countries competiting in the Eurovision{" "}
              {season} Grand Final have been confirmed.
            </p>
          </Panel>
        </>
      ) : predictionFreezeTime.getTime() > new Date().getTime() ? (
        <EditPredictions
          competition={"eurovision"}
          displayName={displayName}
          initialEntrants={JSON.parse(JSON.stringify(countryArr))}
          predictionFreezeTime={predictionFreezeTime}
          season={season}
          userId={userId}>
          <Panel>
            <p>
              Drag the countries into the order which you think they will finish
              in.
            </p>
          </Panel>
          <Panel>
            <p>
              Predictions will lock when the voting results start being
              announced. You can edit your predictions up until{" "}
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
            {isSeasonOver
              ? `Eurovision ${season} is over, come back next year!`
              : "The results are being announced and so predictions are frozen!"}
          </p>
        </Panel>
      )}
    </>
  );
};

export default Page;
