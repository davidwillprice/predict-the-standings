"use client";
import { useState, useRef } from "react";
import Link from "next/link";

import { Button } from "@components/button/button";
import { LoadingSpinner } from "@components/loading-spinner/loading-spinner";
import { FeedbackContainer } from "@components/feedback-container/feedback-container";
import Icon from "@svgs/icons/sq-icon";

import { Entrant } from "@custom-types/game-types";
import { submitPredictionsQuery } from "@lib/db-functions";

import { Sport } from "@custom-types/misc";

import styles from "@components/submit-predictions/submit-predictions.module.scss";
import btnConstyles from "@components/button/button-containers.module.scss";

interface Props {
  driverArr: Entrant[];
  predictionFreezeTime: Date;
  season: string;
  sport: Sport;
  teamArr: Entrant[];
  userId: number;
}

export const SubmitPredictions = ({
  driverArr,
  predictionFreezeTime,
  season,
  sport,
  teamArr,
  userId,
}: Props) => {
  const submissionSuccessful = useRef(false);
  const [submitting, isSubmitting] = useState(false);
  const [savedDriverArr, setSavedDriverArr] = useState(driverArr);
  const [savedTeamArr, setSavedTeamArr] = useState(teamArr);
  const [error, isError] = useState<string | null>(null);

  const submissionHandler = async () => {
    isError(null);
    isSubmitting(true);

    /**If passed the freeze time, show error */
    if (predictionFreezeTime.getTime() < new Date().getTime()) {
      isError("The season has started and predictions are frozen");
      isSubmitting(false);
      return;
    }

    try {
      await submitPredictionsQuery(driverArr, season, sport, teamArr, userId);
      setSavedDriverArr(driverArr);
      setSavedTeamArr(teamArr);
      submissionSuccessful.current = true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        isError(error.message);
      }
    }
    isSubmitting(false);
  };

  if (savedDriverArr !== driverArr || savedTeamArr !== teamArr) {
    submissionSuccessful.current = false;
  }

  /**If no changes have been made on first load, the submit button doesn't show until changes have been made
   * On a submission attempt with an error, the submit button stays with new error feedback
   * On successful submission, submit button disappears and a confirmation shows, until changes are made again when the button and confirmation swap
   */
  return (
    <div className={styles.submitPredictionsCon}>
      {savedDriverArr !== driverArr || savedTeamArr !== teamArr ? (
        submitting ? (
          <LoadingSpinner />
        ) : (
          <div className={btnConstyles.single}>
            <Button onClick={submissionHandler}>
              <Icon strokeWidth={2} type="submit" />
              Submit Predictions
            </Button>
          </div>
        )
      ) : submissionSuccessful.current ? (
        <>
          <FeedbackContainer iconType="success">
            <p>
              <span>Submission Successful!</span>
            </p>
            <p>
              Once the first race of the season completes, you&apos;ll be able
              to track how accurate you are compared to everyone else on the{" "}
              <Link href="/formula-1/2024">leaderboard page</Link> throughout
              the season.
            </p>
            <p>
              You can make more changes to your predictions until the opening
              weekend&apos;s Free Practice 1.
            </p>
          </FeedbackContainer>
        </>
      ) : (
        ""
      )}
      {/**@todo Hide error feedback if the predictions change after error started */}
      {/**@todo Need to limit database calls - Add lock for 10 seconds? - Add state to check if the table is the same as it was last submitted */}
      {error ? (
        <FeedbackContainer iconType="error">
          <p>
            <span>Error: {error.charAt(0).toUpperCase() + error.slice(1)}</span>
          </p>
        </FeedbackContainer>
      ) : (
        ""
      )}
    </div>
  );
};
