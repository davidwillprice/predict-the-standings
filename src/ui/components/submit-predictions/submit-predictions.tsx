"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { submitPredictionsQuery } from "@lib/db-functions";
import { getSpecificGameDataIdFromSessionUser } from "@lib/misc";

import { Button } from "@components/button/button";
import { LoadingSpinner } from "@components/loading-spinner/loading-spinner";
import { FeedbackContainer } from "@components/feedback-container/feedback-container";
import Icon from "@svgs/icons/sq-icon";

import { Entrant, CompetitionStrings } from "@custom-types/game-types";
import { UserDataFromSession } from "@custom-types/misc";

import styles from "@components/submit-predictions/submit-predictions.module.scss";
import btnConstyles from "@components/button/button-containers.module.scss";

interface Props {
  arePredictionsFrozen: boolean;
  competitionStrs: CompetitionStrings;
  currUser: UserDataFromSession;
  displayName: string;
  allEntrantArrs: { [entrantType: string]: Entrant[] };
  season: string;
}

export const SubmitPredictions = ({
  competitionStrs,
  currUser,
  displayName,
  allEntrantArrs,
  arePredictionsFrozen,
  season,
}: Props) => {
  const { data: session, update } = useSession();
  const submissionSuccessful = useRef(false);
  const [submitting, isSubmitting] = useState(false);
  const [savedEntrantArrs, setSavedEntrantArrs] = useState(allEntrantArrs);
  const [error, isError] = useState<string | null>(null);

  const gameDataId = getSpecificGameDataIdFromSessionUser(
    season,
    competitionStrs.shortHand,
    currUser
  );

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
      const result = await submitPredictionsQuery(
        competitionStrs.shortHand,
        displayName,
        predictionObj,
        gameDataId,
        season,
        currUser.id
      );
      /**If the DB has provided a 24 character ObjectId, show success message, save new entrant array, and add a note of the prediction to the user's session, else show the error message in the UI*/
      if (result.length !== 24) {
        isError(result);
      } else {
        setSavedEntrantArrs(allEntrantArrs);
        submissionSuccessful.current = true;

        /**If it's the users first prediction in this comp/season */
        if (
          !session?.user?.predictionsMadeFor?.[
            competitionStrs.shortHand
          ].includes(season)
        ) {
          //**Get all predictionMadeFor data from the session or start a new object if there is none  */
          const currentUser: UserDataFromSession = session?.user;
          const predictionsMadeFor = currentUser.predictionsMadeFor || {};
          if (!predictionsMadeFor[competitionStrs.shortHand]) {
            predictionsMadeFor[competitionStrs.shortHand] = [];
          }
          /**Don't add another season string if one already exists */
          if (
            !predictionsMadeFor[competitionStrs.shortHand].find(
              (seasonObj) => seasonObj.season === season
            )
          ) {
            predictionsMadeFor[competitionStrs.shortHand].push({
              season: season,
              _id: result,
            });
          }
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
          "An error occurred, please try and submit your predictions again"
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
    <div className={styles.submit_predictions_con}>
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
                  announced. Once all the results are in, you&apos;ll be able to
                  track how accurate you are compared to everyone else on the{" "}
                  <Link href={`/${competitionStrs.hyphenated}/${season}`}>
                    leaderboard page
                  </Link>
                  .
                </p>
              ) : competitionStrs.shortHand === "pl" ? (
                <p>
                  You can make additional changes until the first game of the
                  season kicks off. After the first gameweek, you&apos;ll be
                  able to track how accurate you are compared to everyone else
                  on the{" "}
                  <Link href={`/${competitionStrs.hyphenated}/${season}`}>
                    leaderboard page
                  </Link>
                  .
                </p>
              ) : (
                <p>
                  You can make more changes to your predictions until the
                  opening weekend&apos;s Free Practice 1. Once the first race of
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
