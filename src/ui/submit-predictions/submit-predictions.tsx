"use client";

import { submitPredictions } from "@lib/db-functions";
import { Button } from "@ui/button";

import { F1DriverEntrant } from "@custom-types/entrants";
import { Sport } from "@custom-types/misc";

/**@todo Need to add error catching with warnings/confirmation that a submission is saved */
/**@todo Need to limit database calls - Add lock for 10 seconds? - Add state to check if the table is the same as it was last submitted */
/**@todo Need to lock button after season start*/
/**@todo Need button to view leaderboards if season has started?*/
interface Props {
  entrantArr: F1DriverEntrant[];
  season: string;
  sport: Sport;
}

export const SubmitPredictions = ({ entrantArr, season, sport }: Props) => {
  return (
    <Button
      onClick={async () => {
        await submitPredictions(entrantArr, season, sport);
      }}>
      Submit Predictions
    </Button>
  );
};
