"use client";

import { ContentContainer } from "@ui/content-container";
import { Panel } from "@ui/panel";
import { PanelHeading } from "@ui/panel-heading";
import { Button } from "@ui/button";

import { entrants } from "@data/formula-1/2023";
import { sortF1DriverEntrantsAlphabetically } from "@lib/misc";

import SubmitPredictions from "@app/ui/submit-predictions";

export default function Page() {
  const entrantsArr = [
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
  ];

  const initialEntrants = sortF1DriverEntrantsAlphabetically(entrantsArr);

  return (
    <>
      <PanelHeading>
        <h1>Predict the Final Standings</h1>
      </PanelHeading>
      <ContentContainer>
        <div>
          <SubmitPredictions initialEntrants={initialEntrants} />
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
            <p></p>
          </Panel>
          <Panel>
            <p>
              Predictions will lock at the start of opening weekend&apos;s Free
              Practice 1. You can edit your predictions up until the time below:
            </p>
            <p>11:30am GMT 29th February 2024</p>
          </Panel>
          <Button>Submit</Button>
        </div>
      </ContentContainer>
    </>
  );
}
