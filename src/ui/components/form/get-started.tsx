"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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
  lastDisplayNameSubmissionDate: Date | undefined;
}

export const GetStartedForm = ({ initialDisplayName }: Props) => {
  const router = useRouter();
  const { data: session, update } = useSession();

  /**@todo Don't pick something disruptive or offensive*/
  /**@todo If possible, don't let them submit their display name if they already have it*/

  const [displayNameErrorArr, setDisplayNameErrorArr] = useState(
    validateDisplayName(initialDisplayName)
  );
  const [submitting, isSubmitting] = useState(false);

  const isDisplayNameValid = displayNameErrorArr.length === 0;

  const handleDisplayNameChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const newDisplayName = event.currentTarget.value;
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
        new Date().getTime() -
          Date.parse(session?.user.lastDisplayNameSubmissionDate) <
          dayInMilliseconds
      ) {
        throw new Error("You can only submit a new display name once a day");
      }

      const errorMessage = await submitDisplayName(formData);
      if (errorMessage) {
        throw new Error(errorMessage);
      } else {
        {
          /**@todo Show confirmation of display name for a few seconds before the redirect */
          /**@todo Once they've submitted a value display name, show links to currently running competitions, or have a message of something like 'Come back soon' if there are no predictions to make at the moment */
        }
        await update({
          ...session,
          user: {
            ...session?.user,
            displayName: formData.get("displayName"),
            lastDisplayNameSubmissionDate: new Date(),
          },
        });
        router.push("/formula-1/predict");
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
        <div className={styles.input_container}>
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
            aria-describedby={isDisplayNameValid ? "false" : "displayNameError"}
          />
        </div>
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
