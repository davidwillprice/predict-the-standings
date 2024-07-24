"use client";

import { useState, FormEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { submitDisplayName } from "@lib/form-server-actions";
import { validateDisplayName } from "@lib/form-functions";

import { LoadingSpinner } from "@components/loading-spinner/loading-spinner";
import { FeedbackContainer } from "@components/feedback-container/feedback-container";
import Icon from "@svgs/icons/sq-icon";

import styles from "@components/form/form.module.scss";
import btnStyles from "@components/button/button.module.scss";
import commonStyles from "@styles/common.module.scss";
import btnConstyles from "@components/button/button-containers.module.scss";

interface Props {
  initialDisplayName: string;
}

export const SetInitialDisplayNameForm = ({ initialDisplayName }: Props) => {
  const router = useRouter();
  const { data: session, update } = useSession({ required: true });

  /**@todo If possible, don't let them submit their display name if they already have it*/

  const [displayNameErrorArr, setDisplayNameErrorArr] = useState(
    validateDisplayName(initialDisplayName)
  );
  const [submitting, isSubmitting] = useState(false);
  const submissionSuccessful = useRef(false);
  const isDisplayNameValid = displayNameErrorArr.length === 0;

  const redirect = () => {
    setTimeout(() => {
      router.push("/competitions");
    }, 3000);
  };

  const handleDisplayNameChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const newDisplayName = event.currentTarget.value;
    submissionSuccessful.current = false;
    setDisplayNameErrorArr(validateDisplayName(newDisplayName));
  };

  const handleDisplayNameSubmission = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    isSubmitting(true);
    try {
      /**Stop users from repeatedly submitting display names */
      const dayInMilliseconds = 86400000;
      if (
        session?.user.lastDisplayNameSubmissionDate &&
        new Date().getTime() - session?.user.lastDisplayNameSubmissionDate <
          dayInMilliseconds
      ) {
        throw new Error("You can only submit a new display name once a day");
      }

      const errorMessage = await submitDisplayName(formData);
      if (errorMessage) {
        throw new Error(errorMessage);
      } else {
        await update({
          ...session,
          user: {
            ...session?.user,
            displayName: formData.get("displayName"),
            lastDisplayNameSubmissionDate: new Date().getTime(),
          },
        });
        isSubmitting(false);
        /**@todo The redirect delay doesn't work properly currently because the session's display name being set essentially refreshes the page, so for now this redirects immediately and no feedback is shown which isn't ideal*/
        //redirect();
        router.push("/competitions");
        /**Needing to refresh sucks, but without it NextAuth doesn't recognise that a display name has been added to the session and if you return to /profile then it acts as if you haven't set a display name
         * Storing the displayName in a ref or state didn't help as they would get wiped
         * Adding it to local storage would work but would be an annoying faff
         * The `predictionsMadeFor` session data seems to update okay somehow
         */
        router.refresh();
        submissionSuccessful.current = true;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setDisplayNameErrorArr([error.message]);
      }
      isSubmitting(false);
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleDisplayNameSubmission}>
        <div className={styles.input_row}>
          <label className={commonStyles.bold} htmlFor="displayName">
            Display Name:
          </label>
          <input
            required
            pattern="^[a-zA-Z0-9_]*$"
            id="displayName"
            name="displayName"
            onChange={handleDisplayNameChange}
            defaultValue={initialDisplayName}
            autoComplete="off"
            aria-invalid={!isDisplayNameValid}
            aria-describedby={
              isDisplayNameValid ? "displayNameSuccess" : "displayNameError"
            }
          />
        </div>
        {/**If the display name is invalid, show why
         * If submitting, show a spinner. Else if the submission was successful, show a feedback banner. Else show a submission button
         */}
        {!isDisplayNameValid ? (
          <FeedbackContainer iconType="error">
            {displayNameErrorArr.length === 1 ? (
              <p id="displayNameError">{displayNameErrorArr[0]}</p>
            ) : (
              <ul id="displayNameError" className={styles.rulesErrors}>
                {displayNameErrorArr.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}
          </FeedbackContainer>
        ) : (
          ""
        )}
        <div className={commonStyles.flexColCenter}>
          {submitting ? (
            <LoadingSpinner />
          ) : submissionSuccessful.current ? (
            <FeedbackContainer iconType="success">
              <p id="displayNameSuccess">
                Submission Successful! You will be redirected in 3 seconds.
              </p>
              <p id="displayNameSuccess">
                If you aren&apos;t automatically redirected, please{" "}
                <Link href="/competitions">
                  follow this link to submit your first predictions
                </Link>
                .
              </p>
            </FeedbackContainer>
          ) : (
            <div className={btnConstyles.single}>
              <button
                className={`${btnStyles.button} ${
                  isDisplayNameValid ? "" : btnStyles.disabled
                }`}
                type="submit"
                disabled={!isDisplayNameValid}>
                <Icon strokeWidth={2} type="submit" />
                Submit Display Name
              </button>
            </div>
          )}
        </div>
      </form>
    </>
  );
};
