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

  /**@todo If no changes have been made on first load, the submit button shouldn't show until changes have been made
   * On error submission, the button should stay but feedback should show
   * On successful submission, the button should disappear and a confirmation should show, until changes are made when the button and confirmation toggle again
   */
  return (
    <div className={styles.submitPredictionsCon}>
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
