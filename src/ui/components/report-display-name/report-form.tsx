"use client";
import { useState, useRef } from "react";

import Icon from "@svgs/icons/sq-icon";
import { LoadingSpinner } from "@components/loading-spinner/loading-spinner";
import { FeedbackContainer } from "@components/feedback-container/feedback-container";

import formStyles from "@components/form/form.module.scss";
import btnStyles from "@components/button/button.module.scss";
import btnConstyles from "@components/button/button-containers.module.scss";

import { UserGameData } from "@custom-types/game-types";

type Props = {
  reportedUser: UserGameData;
  currentUserId: string | null;
  currentUserDisplayName: string | null;
};

const ReportForm = ({
  reportedUser,
  currentUserDisplayName,
  currentUserId,
}: Props) => {
  const isReasonGiven = true;
  const [submitting, isSubmitting] = useState(false);
  const submissionSuccessful = useRef<null | Boolean>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    isSubmitting(true);
    /**I would have liked to have used <form action={}> and the formData directly, but resend was unresponsive */
    const formData = new FormData(event.currentTarget);
    formData.set("reportedDisplayName", reportedUser.displayName);
    formData.set("reportedUserId", reportedUser.userId);
    formData.set("reporterDisplayName", currentUserDisplayName || "");
    formData.set("reporterUserId", currentUserId || "");

    try {
      /**@todo Need to limit how many reports are made by a user to avoid spam */
      const response = await fetch("/api/email/report", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        submissionSuccessful.current = true;
      } else {
        console.error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      isSubmitting(false);
    }
  };

  return (
    <form className={formStyles.form} onSubmit={handleSubmit}>
      <label htmlFor="reason">
        Please explain why the display name is offensive:
      </label>
      <textarea name="reason" placeholder="Enter reason" />
      {submitting ? (
        <LoadingSpinner />
      ) : submissionSuccessful.current === true ? (
        <FeedbackContainer iconType="success">
          <p id="displayNameSuccess">
            Report successful! We will review your submission and take action if
            necessary.
          </p>
        </FeedbackContainer>
      ) : submissionSuccessful.current === false ? (
        <FeedbackContainer iconType="error">
          <p id="displayNameError">
            Report unsuccessful, please try again later or email{" "}
            <a href="mailto:predictthestandings@protonmail.com">
              predictthestandings@protonmail.com
            </a>
            .
          </p>
        </FeedbackContainer>
      ) : (
        <div className={btnConstyles.single}>
          <button
            className={btnStyles.button}
            type="submit"
            disabled={!isReasonGiven}>
            <Icon strokeWidth={2} type="submit" />
            Submit Report
          </button>
        </div>
      )}
    </form>
  );
};

export default ReportForm;
