"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { Button } from "@components/button/button";
import { LoadingSpinner } from "@components/loading-spinner/loading-spinner";
import { FeedbackContainer } from "@components/feedback-container/feedback-container";
import Icon from "@svgs/icons/sq-icon";

import { Entrant, CompetitionStrings } from "@custom-types/game-types";
import { submitPredictionsQuery } from "@lib/db-functions";

import styles from "@components/submit-predictions/submit-predictions.module.scss";
import btnConstyles from "@components/button/button-containers.module.scss";

interface Props {
  arePredictionsFrozen: boolean;
  competitionStrs: CompetitionStrings;
  displayName: string;
  allEntrantArrs: { [entrantType: string]: Entrant[] };
  season: string;
  userId: string;
}

export const SubmitPredictions = ({
  competitionStrs,
  displayName,
  allEntrantArrs,
  arePredictionsFrozen,
  season,
  userId,
}: Props) => {
  const { data: session, update } = useSession();
  const submissionSuccessful = useRef(false);
  const [submitting, isSubmitting] = useState(false);
  const [savedEntrantArrs, setSavedEntrantArrs] = useState(allEntrantArrs);
  const [error, isError] = useState<string | null>(null);

  const submissionHandler = async () => {
    isError(null);
    isSubmitting(true);

    /**If passed the freeze time, show error */
    if (arePredictionsFrozen) {
      isError("The season has started and predictions are frozen");
      isSubmitting(false);
      return;
    }
    const predictionObj: { [entrantType: string]: string[] } = {};
    for (const entrantType of Object.keys(allEntrantArrs)) {
      predictionObj[entrantType] = allEntrantArrs[entrantType].map(
        (entrant) => entrant.sName
      );
    }
    try {
      const dbErrorMessage = await submitPredictionsQuery(
        competitionStrs.shortHand,
        displayName,
        predictionObj,
        season,
        userId
      );
      /**If the DB has provided a user safe error message, add it to the UI, else show success message, save new entrant array, and add a note of the prediction to the user's session */
      if (typeof dbErrorMessage === "string") {
        isError(dbErrorMessage);
      } else {
        setSavedEntrantArrs(allEntrantArrs);
        submissionSuccessful.current = true;

        /**If it's the users first prediction in this comp/season */
        if (
          !session?.user?.predictionsMadeFor?.[
            competitionStrs.shortHand
          ].includes(season)
        ) {
          //**Get all predictionMadeFor data or start a new object if there is none  */
          const predictionsMadeFor = session?.user.predictionsMadeFor || {};
          if (!predictionsMadeFor[competitionStrs.shortHand]) {
            predictionsMadeFor[competitionStrs.shortHand] = [];
          }
          predictionsMadeFor[competitionStrs.shortHand].push(season);
          await update({
            ...session,
            user: {
              ...session?.user,
              predictionsMadeFor: predictionsMadeFor,
            },
          });
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
        isError(
          "An error occured, please try and submit your predictions again"
        );
      }
    }
    isSubmitting(false);
  };

  if (savedEntrantArrs !== allEntrantArrs) {
    submissionSuccessful.current = false;
  }

  /**If no changes have been made on first load, the submit button doesn't show until changes have been made
   * On a submission attempt with an error, the submit button stays with new error feedback
   * On successful submission, submit button disappears and a confirmation shows, until changes are made again when the button and confirmation swap
   */
  return (
    <div className={styles.submitPredictionsCon}>
      {savedEntrantArrs !== allEntrantArrs ? (
        submitting ? (
          <LoadingSpinner />
        ) : (
          <div className={btnConstyles.single}>
            <Button onClick={submissionHandler}>
              <Icon strokeWidth={2} type="submit" />
              Save Predictions
            </Button>
          </div>
        )
      ) : (
        submissionSuccessful.current && (
          <>
            <FeedbackContainer iconType="success">
              <p>
                <span>Predictions Saved!</span>
              </p>
              {competitionStrs.shortHand === "eurovision" ? (
                <p>
                  You can make additional changes until the votes start being
                  annouced. Once all the results are in, you&apos;ll be able to
                  track how accurate you are compared to everyone else on the{" "}
                  <Link href={`/${competitionStrs.hyphenated}/${season}`}>
                    leaderboard page
                  </Link>
                  .
                </p>
              ) : (
                <p>
                  You can make more changes to your predictions until the
                  opening weekend&apos;s Free Practice 1.Once the first race of
                  the season completes, you&apos;ll be able to track how
                  accurate you are compared to everyone else on the{" "}
                  <Link href={`/${competitionStrs.hyphenated}/${season}`}>
                    leaderboard page
                  </Link>{" "}
                  throughout the season.
                </p>
              )}
            </FeedbackContainer>
          </>
        )
      )}
      {/**@todo Hide error feedback if the predictions change after error started */}
      {/**@todo Need to limit database calls - Add lock for 10 seconds? - Add state to check if the table is the same as it was last submitted */}
      {error && (
        <FeedbackContainer iconType="error">
          <p>
            <span>Error: {error.charAt(0).toUpperCase() + error.slice(1)}</span>
          </p>
        </FeedbackContainer>
      )}
    </div>
  );
};
