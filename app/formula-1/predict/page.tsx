import { query } from "@lib/db";
import { entrants } from "@data/formula-1/2023";

import { sortF1DriverEntrantsAlphabetically } from "@lib/misc";

import { ContentContainer } from "@ui/content-container";
import { Panel } from "@ui/panel";
import { PanelHeading } from "@ui/panel-heading";
import { SubmitPredictions } from "@ui/submit-predictions/submit-predictions";
import { EditablePredictionTable } from "@ui/submit-predictions/editable-prediction-table";

import { F1DriverEntrant } from "@custom-types/entrants";

export default async function Page() {
  const defaultEntrantsArr = sortF1DriverEntrantsAlphabetically([
    entrants.drivers.ham,
    entrants.drivers.bot,
    entrants.drivers.lec,
    entrants.drivers.sai,
    entrants.drivers.ver,
    entrants.drivers.per,
    entrants.drivers.alo,
    entrants.drivers.oco,
    entrants.drivers.hul,
    entrants.drivers.mag,
    entrants.drivers.nor,
    entrants.drivers.pia,
    entrants.drivers.ric,
    entrants.drivers.str,
    entrants.drivers.zho,
    entrants.drivers.alb,
    entrants.drivers.tsu,
    entrants.drivers.gas,
    entrants.drivers.sar,
    entrants.drivers.rus,
  ]);
  let entrantArr: F1DriverEntrant[];
  try {
    const res = await query(`SELECT f1_2024
  FROM users
  WHERE id = 1`);
    if (res.rows[0]["f1_2024"] === null) {
      entrantArr = defaultEntrantsArr;
    } else {
      entrantArr = res.rows[0]["f1_2024"].map(
        (entrantStr: string) => entrants.drivers[entrantStr]
      );
    }
  } catch (error) {
    throw error;
  }
  return (
    <>
      <PanelHeading>
        <h1>Predict the Final Standings</h1>
      </PanelHeading>
      <ContentContainer>
        <div>
          <EditablePredictionTable
            initialEntrants={JSON.parse(JSON.stringify(entrantArr))}
          />
        </div>
        <div>
          <Panel>
            <p>
              Drag the drivers into the order which you think they will be in at
              the end of the&nbsp;season.
            </p>
            <p>
              Any new drivers entering the season midway through won&apos;t be
              included in the final standings.
            </p>
          </Panel>
          <Panel>
            <p>
              Predictions will lock at the start of opening weekend&apos;s Free
              Practice 1. You can edit your predictions up until the time below:
            </p>
            {/**@todo Load date/time from a single variable at the top of the page */}
            <p>11:30am GMT 29th February 2024</p>
          </Panel>
          <SubmitPredictions />
        </div>
      </ContentContainer>
    </>
  );
}
