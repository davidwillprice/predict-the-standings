"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

import { submitDisplayName } from "@lib/form-server-actions";
import { validateDisplayName } from "@lib/form-functions";

import { LoadingSpinner } from "@components/loading-spinner/loading-spinner";
import { FeedbackContainer } from "@components/feedback-container/feedback-container";

import styles from "@components/form/form.module.scss";
import btnStyles from "@components/button/button.module.scss";
import commonStyles from "@styles/common.module.scss";

interface Props {
  initialDisplayName: string;
}

export const GetStartedForm = ({ initialDisplayName }: Props) => {
  const router = useRouter();
  /**@todo Don't pick something disruptive or offensive*/
  /**@todo If they haven't submitted a valid display name, redirect them from the prediction pages until they have*/
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
      const errorMessage = await submitDisplayName(formData);
      if (errorMessage) {
        throw new Error(errorMessage);
      } else {
        {
          /**@todo Show confirmation of display name for a few seconds before the redirect */
          /**@todo Redirect to a page which shows a selection of possible predictions to submit */
        }
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
          <label htmlFor="displayName">Display Name:</label>
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
              <ul id="displayNameError" className={styles.rules}>
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
            <button
              className={`${btnStyles.button} ${
                isDisplayNameValid ? "" : btnStyles.disabled
              }`}
              type="submit"
              disabled={!isDisplayNameValid}>
              Submit Display Name
            </button>
          )}
        </div>
      </form>
    </>
  );
};
