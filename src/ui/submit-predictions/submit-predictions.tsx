"use client";

import { submitPredictions } from "@lib/db-functions";
import { Button } from "@ui/button";

import { F1DriverEntrant } from "@custom-types/entrants";

/**@todo Need to add error catching with warnings/confirmation that a submission is saved */
/**@todo Need to limit database calls - Add lock for 10 seconds? - Add state to check if the table is the same as it was last submitted */
/**@todo Need to lock button after season start*/
/**@todo Need button to view leaderboards if season has started?*/
interface Props {
  entrantArr: F1DriverEntrant[];
}

export const SubmitPredictions = ({ entrantArr }: Props) => {
  return (
    <Button
      onClick={async () => {
        await submitPredictions(entrantArr);
      }}>
      Submit Predictions
    </Button>
  );
};
