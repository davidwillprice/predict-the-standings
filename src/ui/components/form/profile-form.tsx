"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

import Icon from "@svgs/icons/sq-icon";
import { FeedbackContainer } from "@components/feedback-container/feedback-container";

import styles from "@components/form/form.module.scss";

interface Props {
  initialDisplayName: string;
}

export const ProfileForm = ({ initialDisplayName }: Props) => {
  const { data: session, update } = useSession();
  const [error, setError] = useState<string>();

  /**Stop users from repeatedly submitting display names */
  const dayInMilliseconds = 86400000;
  const allowedToEditDisplayName =
    session?.user.lastDisplayNameSubmissionDate &&
    new Date().getTime() -
      Date.parse(session?.user.lastDisplayNameSubmissionDate) <
      dayInMilliseconds;
  console.log(error);
  return (
    <form className={styles.form}>
      <div className={styles.input_row}>
        <label htmlFor="name">Display Name</label>
        <div className={styles.input_container}>
          <input
            id="name"
            type="name"
            name="name"
            value={initialDisplayName}
            disabled
          />
          <button
            className={styles.edit_input_btn}
            onClick={(e) => {
              e.preventDefault();
              setError(
                "This isn't implemented yet, but you'll be able to edit your display name once a day"
              );
            }}
            aria-label="Edit Display Name">
            <Icon strokeWidth={2} type={"edit"} />
          </button>
        </div>
      </div>
      {error ? (
        <FeedbackContainer iconType="error">
          <p>{error}</p>
        </FeedbackContainer>
      ) : (
        ""
      )}
    </form>
  );
};
