"use client";
import { useState, useRef } from "react";

import { Button } from "@components/button/button";
import { LoadingSpinner } from "@components/loading-spinner/loading-spinner";
import { FeedbackContainer } from "@components/feedback-container/feedback-container";

import { Entrant } from "@custom-types/game-types";
import { submitPredictions } from "@lib/db-functions";

import { Sport } from "@custom-types/misc";

import styles from "@components/submit-predictions/submit-predictions.module.scss";

interface Props {
  entrantArr: Entrant[];
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
          /**@todo URGENT Need to lock button after season start*/
          <Button onClick={submissionHandler}>Submit Predictions</Button>
        )
      ) : submissionSuccessful.current ? (
        <FeedbackContainer iconType="success">
          <p>Submission Successful</p>
        </FeedbackContainer>
      ) : (
        ""
      )}
      {/**@todo URGENT Hide error feedback if the predictions change after error started */}
      {/**@todo Need to limit database calls - Add lock for 10 seconds? - Add state to check if the table is the same as it was last submitted */}
      {error ? (
        <FeedbackContainer iconType="error">
          <p>Error: {error.charAt(0).toUpperCase() + error.slice(1)}</p>
        </FeedbackContainer>
      ) : (
        ""
      )}
    </div>
    /**@todo URGENT Need button to view leaderboards if season has started?*/
  );
};
