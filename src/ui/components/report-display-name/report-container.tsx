"use client";

import { useState } from "react";

import ReportForm from "@components/report-display-name/report-form";
import Modal from "@components/modal/modal";
import { Button } from "@components/button/button";

import { UserGameData } from "@custom-types/game-types";

type Props = {
  reportedUser: UserGameData;
  currentUserId: string | undefined;
  currentUserDisplayName: string | undefined;
};

export default function ReportContainer({
  reportedUser,
  currentUserId,
  currentUserDisplayName,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button onClick={() => openModal()}>Report Display Name</Button>
      <Modal
        heading={`Report Display Name - '${reportedUser.displayName}'`}
        isOpen={isModalOpen}
        onClose={closeModal}>
        {currentUserId ? (
          <ReportForm
            reportedUser={reportedUser}
            currentUserId={currentUserId}
            currentUserDisplayName={currentUserDisplayName}
          />
        ) : (
          <p>
            Please email{" "}
            <a
              href={`mailto:predictthestandings@protonmail.com?subject=Display%20Name%20Report%20-%20${reportedUser.displayName}&body=Please%20remove%20the%20display%20name%3A%20${reportedUser.displayName}%0A%0AI%20find%20it%20offensive%20because`}>
              predictthestandings@protonmail.com
            </a>{" "}
            and provide details of the offensive display name.
          </p>
        )}
      </Modal>
    </>
  );
}
