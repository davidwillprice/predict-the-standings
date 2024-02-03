"use client";
import { useState, useRef } from "react";

import { Button } from "@components/button/button";
import { LoadingSpinner } from "@components/loading-spinner/loading-spinner";
import Icon from "@svgs/icons/sq-icon";

import { F1DriverEntrant } from "@custom-types/entrants";
import { submitPredictions } from "@lib/db-functions";

import { Sport } from "@custom-types/misc";

import styles from "@components/submit-predictions/submit-predictions.module.scss";

/**@todo Need to add error catching with warnings/confirmation that a submission is saved */
/**@todo Need to limit database calls - Add lock for 10 seconds? - Add state to check if the table is the same as it was last submitted */
/**@todo Need to lock button after season start*/
/**@todo Need button to view leaderboards if season has started?*/
interface Props {
  entrantArr: F1DriverEntrant[];
  season: string;
  sport: Sport;
  userId: number;
}

export const SubmitPredictions = ({
  entrantArr,
  season,
  sport,
  userId,
}: Props) => {
  const submissionSuccessful = useRef(false);
  const [submitting, isSubmitting] = useState(false);
  const [savedEntrantArr, setSavedEntrantArr] = useState(entrantArr);
  const [error, isError] = useState<string | null>(null);

  const submissionHandler = async () => {
    isError(null);
    isSubmitting(true);
    try {
      await submitPredictions(entrantArr, season, sport, userId);
      setSavedEntrantArr(entrantArr);
      submissionSuccessful.current = true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        isError(error.message);
      }
    }
    isSubmitting(false);
  };

  if (savedEntrantArr !== entrantArr) {
    submissionSuccessful.current = false;
  }
  console.log(submissionSuccessful);

  /**If no changes have been made on first load, the submit button doesn't show until changes have been made
   * On a submission attempt with an error, the submit button stays with new error feedback
   * On successful submission, submit button disappears and a confirmation shows, until changes are made again when the button and confirmation swap
   */
  return (
    <div className={styles.submitPredictionsCon}>
      {savedEntrantArr !== entrantArr ? (
        submitting ? (
          <LoadingSpinner />
        ) : (
          <Button onClick={submissionHandler}>Submit Predictions</Button>
        )
      ) : submissionSuccessful.current ? (
        <div className={`${styles.success} ${styles.feedback}`}>
          <div className={styles.icon}>
            <Icon type={"success"} strokeWidth={2} />
          </div>
          Submission Successful
        </div>
      ) : (
        ""
      )}
      {error ? (
        <>
          <div className={`${styles.error} ${styles.feedback}`}>
            <div className={styles.icon}>
              <Icon type={"error"} strokeWidth={2} />
            </div>
            Error: {error.charAt(0).toUpperCase() + error.slice(1)}
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};
