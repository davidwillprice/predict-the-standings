"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { getCollectionObjFromPredictionsMadeFor } from "@lib/misc";
import {
  anonymiseUserGameDataQuery,
  deleteAccountQuery,
} from "@lib/db-functions";

import Modal from "@components/modal/modal";
import { Button } from "@components/button/button";
import Icon from "@ui/svgs/icons/sq-icon";
import { FeedbackContainer } from "@components/feedback-container/feedback-container";
import { LoadingSpinner } from "@components/loading-spinner/loading-spinner";

import btnStyles from "@components/button/button.module.scss";
import formStyles from "@components/form/form.module.scss";

import { UserDataFromSession } from "@custom-types/misc";

type Props = {
  user: UserDataFromSession;
};

export const DeleteAccount = ({ user }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState<
    "loading" | "success" | "db-error" | "mistyped-confirmation" | null
  >(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmationChange = () => {
    setConfirmationStatus(null);
  };

  const handleDeletionRequest = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    /**If user has confirmed they want their account deleted... */
    if (formData.get("confirmation") === "DELETE") {
      /**Show loading UI while request is processed*/
      setConfirmationStatus("loading");
      try {
        /**Get all strings from `predictionsMadeFor` via the user session */
        const gameDataCollectionObjArr =
          getCollectionObjFromPredictionsMadeFor(user);

        /**If the user has made predictions...*/
        if (gameDataCollectionObjArr) {
          /**Change their display name in all their userGameData to [DELETED] */
          await Promise.all(
            gameDataCollectionObjArr.map((collectionObj) =>
              anonymiseUserGameDataQuery(
                collectionObj.collectionName,
                collectionObj._id
              )
            )
          );
        }

        /**Delete the user from the 'users' and 'accounts' collections */
        await Promise.all(
          ["users", "accounts"].map((collectionName) =>
            deleteAccountQuery(collectionName, user.id)
          )
        );

        /**Show success feedback UI */
        setConfirmationStatus("success");
        /**Log user out in 3 seconds */
        setTimeout(() => {
          signOutFn();
        }, 3000);
      } catch (e) {
        console.log(e);
        setConfirmationStatus("db-error");
      }
    } else {
      /**If user has incorrectly typed the confirmation, show feedback UI */
      setConfirmationStatus("mistyped-confirmation");
    }
  };

  const signOutFn = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <Button onClick={() => openModal()} className={btnStyles.error}>
        <Icon strokeWidth={2} type="trash" />
        Delete Account
      </Button>
      <Modal
        heading={"Delete Account"}
        isOpen={isModalOpen}
        onClose={closeModal}>
        <p>
          When you delete your Predict The Standings account, a few things
          happen:
        </p>
        <h4>All your personal data will be deleted</h4>
        <ul>
          <li>
            This includes any account data provided by 0Auth like your email or
            name.
          </li>
          <li>
            Your display name will be deleted and will become available for
            other people to use in the future.
          </li>
        </ul>
        <h4>All your predictions and stats will be permanently dissociated</h4>
        <ul>
          <li>
            Your predictions will become anonymised and remain in the database
            to avoid invalidating previously calculated stats for other people
            like controversy and predictions averages.
          </li>
        </ul>
        <p>
          <strong>
            Deleting your account is irreversible, please confirm you understand
            the above and would like to proceed by typing DELETE into the field
            below.
          </strong>
        </p>
        <form className={formStyles.form} onSubmit={handleDeletionRequest}>
          <div className={formStyles.input_container}>
            <input
              id="confirmation"
              name="confirmation"
              autoComplete="off"
              type="text"
              maxLength={6}
              onChange={handleConfirmationChange}
            />
          </div>
          {confirmationStatus === "loading" ? (
            <LoadingSpinner />
          ) : confirmationStatus === "mistyped-confirmation" ? (
            <FeedbackContainer iconType="error">
              <p>
                Please type DELETE into the field above to confirm you would
                like to permanently delete your account
              </p>
            </FeedbackContainer>
          ) : confirmationStatus === "db-error" ? (
            <FeedbackContainer iconType="error">
              <p>
                There has been an error trying to delete your account - If this
                persists, please email your request to{" "}
                <a href="mailto:predictthestandings@protonmail.com">
                  predictthestandings@protonmail.com
                </a>
                .
              </p>
            </FeedbackContainer>
          ) : confirmationStatus === "success" ? (
            <FeedbackContainer iconType="success">
              <p id="displayNameSuccess">
                Account successfully deleted - You will be logged out in 3
                seconds
              </p>
            </FeedbackContainer>
          ) : (
            ""
          )}
          <Button onClick={() => openModal()} className={btnStyles.error}>
            <Icon strokeWidth={2} type="trash" />
            Delete Account
          </Button>
        </form>
      </Modal>
    </>
  );
};
