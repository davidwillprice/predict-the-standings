import { useRouter } from "next/navigation";

import ReportContainer from "@components/report-display-name/report-container";
import { Button } from "@components/button/button";

import styles from "@components/game/game-container.module.scss";

import { UserGameData } from "@custom-types/game-types";

interface Props {
  currentUserId: string | null;
  currentUserDisplayName: string | null;
  entrantType: string;
  handleBackBtn: Function;
  roundIndex: number;
  selectedUser: UserGameData;
}

export const UserData = ({
  currentUserId,
  currentUserDisplayName,
  entrantType,
  handleBackBtn,
  roundIndex,
  selectedUser,
}: Props) => {
  const router = useRouter();
  return (
    <div className={styles.options}>
      <Button
        onClick={() => {
          handleBackBtn();
          router.back();
        }}>
        Back
      </Button>
      {selectedUser.information && <p>Note: {selectedUser.information}</p>}
      <ReportContainer
        reportedUser={selectedUser}
        currentUserId={currentUserId}
        currentUserDisplayName={currentUserDisplayName}
      />
      <p>
        Leaderboard Position:{" "}
        {selectedUser.season[entrantType][roundIndex].leaderboardPos}
      </p>
      <p>
        Perfect Predictions:{" "}
        {selectedUser.season[entrantType][roundIndex].diffCounts[0]}
      </p>
      <p>
        Controversy Percentile:{" "}
        {selectedUser.controversyPercentile[entrantType]}%
      </p>
    </div>
  );
};
