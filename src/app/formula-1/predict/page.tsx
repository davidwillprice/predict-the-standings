"use client";

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

  return <SubmitPredictions initialEntrants={initialEntrants} />;
}
