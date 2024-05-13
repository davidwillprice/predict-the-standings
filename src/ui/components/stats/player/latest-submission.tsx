import { Panel } from "@components/panels/panel";

import {
  UserGameDataMap,
  UserGameData,
  UserId,
} from "@custom-types/game-types";

interface Props {
  currUser: UserGameData | null;
  predictionFreezeDate: Date;
  userId: UserId;
  users: UserGameDataMap;
}

export const LastestSubmission = ({
  currUser,
  predictionFreezeDate,
  userId,
  users,
}: Props) => {
  const currUserIsLatestSubmission = currUser && userId === currUser.userId;

  const latestSubmissionUser = Object.values(users).find(
    (user) => user.userId === userId
  );

  if (latestSubmissionUser === undefined) throw new Error("User not found");

  const secondsBetweenSubmissionAndFreeze = Math.ceil(
    (predictionFreezeDate.getTime() -
      new Date(latestSubmissionUser?.lastSubmissionTime).getTime()) /
      1000
  );

  const minutesBetweenSubmissionAndFreeze = Math.ceil(
    secondsBetweenSubmissionAndFreeze / 60
  );

  /**If noone submitted a prediction within 60 minutes of the prediction freeze or the user's submission time isn't accurate, don't bother showing this stat at all*/
  if (
    minutesBetweenSubmissionAndFreeze > 60 ||
    secondsBetweenSubmissionAndFreeze < 0
  ) {
    return "";
  }
  return (
    <Panel>
      <h2>Cutting It Fine</h2>
      <>
        <p>
          {currUserIsLatestSubmission
            ? "You"
            : latestSubmissionUser?.displayName}{" "}
          updated {currUserIsLatestSubmission ? "your" : "their"} predictions
          the latest,{" "}
          {secondsBetweenSubmissionAndFreeze < 300
            ? `${secondsBetweenSubmissionAndFreeze} second${
                secondsBetweenSubmissionAndFreeze !== 1 && "s"
              }`
            : `${minutesBetweenSubmissionAndFreeze} minute${
                minutesBetweenSubmissionAndFreeze !== 1 && "s"
              }`}{" "}
          before predictions froze.
        </p>
      </>
    </Panel>
  );
};
