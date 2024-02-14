import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { entrants } from "@data/formula-1/2023";
import { sortEntrantsAlphabetically } from "@lib/misc";
import { getPredictionTable } from "@lib/db-functions";
import { authOptions } from "@lib/auth";

import { ContentContainer } from "@components/content-container/content-container";
import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { EditPredictions } from "@components/submit-predictions/edit-predictions";

import { Entrant } from "@custom-types/game-types";
import { Sport } from "@custom-types/misc";

export const metadata: Metadata = {
  title: "Make Your Predictions | Predict The Standings",
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (session == null) {
    return redirect("/login");
  } else if (session?.user.displayName === null) {
    return redirect("/get-started");
  }
  const userId = session.user.id;
  const sport: Sport = "f1";
  const season = "2024";
  const predictionFreezeTime = new Date("2024-02-29T11:30:00");

  const defaultEntrantsArr = sortEntrantsAlphabetically([
    entrants.ham,
    entrants.bot,
    entrants.lec,
    entrants.sai,
    entrants.ver,
    entrants.per,
    entrants.alo,
    entrants.oco,
    entrants.hul,
    entrants.mag,
    entrants.nor,
    entrants.pia,
    entrants.ric,
    entrants.str,
    entrants.zho,
    entrants.alb,
    entrants.tsu,
    entrants.gas,
    entrants.sar,
    entrants.rus,
  ]);
  let entrantArr: Entrant[];
  try {
    const dbPredictionTable = await getPredictionTable(season, sport, userId);
    entrantArr = dbPredictionTable.map(
      (entrantStr: string) => entrants[entrantStr]
    );
  } catch (_) {
    entrantArr = defaultEntrantsArr;
  }

  return (
    <>
      <PanelHeading align="center">
        <h1>Predict the Final Standings</h1>
      </PanelHeading>
      <ContentContainer>
        {predictionFreezeTime.getTime() > new Date().getTime() ? (
          <EditPredictions
            initialEntrants={JSON.parse(JSON.stringify(entrantArr))}
            predictionFreezeTime={predictionFreezeTime}
            season={season}
            sport={sport}
            userId={userId}>
            <Panel>
              <p>
                Drag the drivers into the order which you think they will be in
                at the end of the&nbsp;season.
              </p>
              <p>
                Any new drivers entering the season midway through won&apos;t be
                included in the final standings.
              </p>
            </Panel>
            <Panel>
              <p>
                Predictions will lock at the start of opening weekend&apos;s
                Free Practice 1. You can edit your predictions up until the time
                below:
              </p>
              <p>{predictionFreezeTime.toString()}</p>
            </Panel>
          </EditPredictions>
        ) : (
          <Panel>
            <p style={{ textAlign: "center" }}>
              The {season} season has started and predictions are frozen!
            </p>
          </Panel>
        )}
      </ContentContainer>
    </>
  );
}
