"use client";

import { useSession } from "next-auth/react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

import { submitDisplayName } from "@lib/form-server-actions";
import { validateDisplayName } from "@lib/form-functions";

import Icon from "@svgs/icons/sq-icon";
import { FeedbackContainer } from "@components/feedback-container/feedback-container";
import { LoadingSpinner } from "@components/loading-spinner/loading-spinner";

import styles from "@components/form/form.module.scss";
import btnStyles from "@components/button/button.module.scss";
import btnConstyles from "@components/button/button-containers.module.scss";
import commonStyles from "@styles/common.module.scss";

interface Props {
  initialDisplayName: string;
}

export const ProfileForm = ({ initialDisplayName }: Props) => {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [isEditable, setEditable] = useState(false);
  const [displayNameErrorArr, setDisplayNameErrorArr] = useState<string[]>([]);
  const [submitting, isSubmitting] = useState(false);
  const submissionSuccessful = useRef(false);
  const isDisplayNameValid = displayNameErrorArr.length > 0 ? false : true;

  /**Stop users from repeatedly submitting display names */
  const hourInMilliseconds = 3600000;
  /**If there isn't a time set when the user last updated their display name, set it to 25hrs so they can submit a new display name */
  const lastDisplayNameSubmissionDate = new Date(
    session?.user.lastDisplayNameSubmissionDate
  ).getTime();
  const hoursSinceDisplayNameChange = lastDisplayNameSubmissionDate
    ? (new Date().getTime() - lastDisplayNameSubmissionDate) /
      hourInMilliseconds
    : 25;
  const hoursUntilDisplayNameSubmittable =
    24 - Math.ceil(hoursSinceDisplayNameChange);

  const editBtnHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (hoursUntilDisplayNameSubmittable <= 0) {
      setEditable(true);
    } else {
      submissionSuccessful.current = false;
      setDisplayNameErrorArr([
        `You can submit a new display name in ${hoursUntilDisplayNameSubmittable} hour${
          hoursUntilDisplayNameSubmittable !== 1 ? "s" : ""
        }`,
      ]);
    }
  };

  const handleDisplayNameChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const newDisplayName = event.currentTarget.value;
    submissionSuccessful.current = false;
    setDisplayNameErrorArr(validateDisplayName(newDisplayName));
  };

  const handleDisplayNameSubmission = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    isSubmitting(true);
    try {
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
        setEditable(false);
        isSubmitting(false);
        submissionSuccessful.current = true;
        router.refresh();
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
          <label htmlFor="name">Display Name</label>
          <div className={styles.input_container}>
            <input
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
              disabled={!isEditable}
            />
            {isEditable ? (
              <div className={btnConstyles.single}>
                <button
                  style={{ marginBottom: 0 }}
                  className={`${btnStyles.button} ${
                    isDisplayNameValid ? "" : btnStyles.disabled
                  }`}
                  type="submit"
                  disabled={!isDisplayNameValid}>
                  <Icon strokeWidth={2} type="submit" />
                  Submit
                </button>
              </div>
            ) : (
              <button
                className={styles.edit_input_btn}
                onClick={editBtnHandler}
                aria-label="Edit Display Name">
                <Icon strokeWidth={2} type={"edit"} />
              </button>
            )}
          </div>
        </div>
        {displayNameErrorArr && displayNameErrorArr.length > 0 ? (
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
            submissionSuccessful.current && (
              <FeedbackContainer iconType="success">
                <p id="displayNameSuccess">
                  Successfully updated display name!
                </p>
              </FeedbackContainer>
            )
          )}
        </div>
      </form>
    </>
  );
};
