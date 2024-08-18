import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { markdownLinksToHTML, numberToOrdinalNumber } from "@lib/misc";

import ReportContainer from "@components/report-display-name/report-container";
import { Button } from "@components/button/button";
import Icon from "@ui/svgs/icons/sq-icon";

import styles from "@components/game/game-container.module.scss";

import { UserGameData } from "@custom-types/game-types";

interface Props {
  currentUserId: string | undefined;
  currentUserDisplayName: string | undefined;
  entrantType: string;
  handleBackBtn: Function;
  isSeasonOver: boolean;
  moreThanOneRound: boolean;
  roundIndex: number;
  selectedUser: UserGameData;
}

export const UserData = ({
  currentUserId,
  currentUserDisplayName,
  entrantType,
  handleBackBtn,
  isSeasonOver,
  moreThanOneRound,
  roundIndex,
  selectedUser,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(useSearchParams());
  /**@todo Add share button */
  const userRoundData = selectedUser.season[entrantType][roundIndex];
  if (userRoundData.diffCounts === undefined) {
    throw new Error("Leaderboard data hasn't been populated properly");
  }
  return (
    <div className={styles.options}>
      <Button
        onClick={() => {
          handleBackBtn();
          params.delete("user");
          router.replace(`${pathname}?${params.toString()}`);
        }}
        smallIcon={true}>
        <Icon strokeWidth={2} type="chevronLeft" />
        Leaderboard
      </Button>
      <ReportContainer
        reportedUser={selectedUser}
        currentUserId={currentUserId}
        currentUserDisplayName={currentUserDisplayName}
      />
      {selectedUser.information && (
        <p>
          Note:{" "}
          <span
            dangerouslySetInnerHTML={{
              __html: markdownLinksToHTML(selectedUser.information),
            }}
          />
        </p>
      )}
      <p>
        Leaderboard Position:{" "}
        {numberToOrdinalNumber(userRoundData.leaderboardPos)}
      </p>
      <p>Perfect Predictions: {userRoundData.diffCounts[0]}</p>
      {selectedUser.displayName !== "Average" && (
        <p>
          Controversy Percentile:{" "}
          {selectedUser.controversyPercentile[entrantType]}%
        </p>
      )}
      {moreThanOneRound &&
        selectedUser.roundsTop &&
        selectedUser.roundsTop[entrantType] && (
          <p>
            {selectedUser._id.toString() !== currentUserId
              ? `${selectedUser.displayName} ${
                  isSeasonOver ? "was" : "has been"
                }`
              : `You ${isSeasonOver ? "were" : "have been"}`}{" "}
            top of the leaderboard for{" "}
            {selectedUser.roundsTop[entrantType].length} round
            {selectedUser.roundsTop[entrantType].length > 1 && "s"} across the
            season.
          </p>
        )}
      {/**@todo Add something like 'Including two X round streaks.*/}
    </div>
  );
};
