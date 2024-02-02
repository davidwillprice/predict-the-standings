"use client";
import { useState } from "react";

import { Button } from "@ui/button";
import { LoadingSpinner } from "@ui/loading-spinner";
import Icon from "@svgs/icons/sq-icon";

import { F1DriverEntrant } from "@custom-types/entrants";
import { submitPredictions } from "@lib/db-functions";

import { Sport } from "@custom-types/misc";

import styles from "@styles/prediction-submission.module.scss";

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
  const [submitting, isSubmitting] = useState(false);
  const [error, isError] = useState<string | null>(null);

  const submissionHandler = async () => {
    isError(null);
    isSubmitting(true);
    try {
      await submitPredictions(entrantArr, season, sport);
    } catch (error: unknown) {
      if (error instanceof Error) {
        isError(error.message);
      }
    }
    isSubmitting(false);
  };

  return (
    <div className={styles.con}>
      {submitting ? (
        <LoadingSpinner />
      ) : (
        <Button onClick={submissionHandler}>Submit Predictions</Button>
      )}
      {error ? (
        <>
          <div className={styles.error}>
            <div className={styles.errorIcon}>
              <Icon type={"error"} strokeWidth={2} />
            </div>
            <p>Error: {error}</p>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};
