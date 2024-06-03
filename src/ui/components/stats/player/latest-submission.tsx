import { Panel } from "@components/panels/panel";

import { GameDataMap, UserGameData } from "@custom-types/game-types";

interface Props {
  currUser: UserGameData | null;
  predictionFreezeDate: Date;
  gameDataId: string;
  gameDataMap: GameDataMap;
}

export const LastestSubmission = ({
  currUser,
  predictionFreezeDate,
  gameDataId,
  gameDataMap,
}: Props) => {
  const latestSubmissionUser = gameDataMap[gameDataId];

  const currUserIsLatestSubmission =
    currUser && latestSubmissionUser?.userId === currUser.userId;

  if (latestSubmissionUser === undefined) throw new Error("User not found");

  const secsBetweenSubmissionAndFreeze = Math.ceil(
    (predictionFreezeDate.getTime() -
      new Date(latestSubmissionUser?.lastSubmissionTime).getTime()) /
      1000
  );

  const minsBetweenSubmissionAndFreeze = Math.ceil(
    secsBetweenSubmissionAndFreeze / 60
  );

  /**If no one submitted a prediction within 60 minutes of the prediction freeze or the user's submission time isn't accurate, don't bother showing this stat at all*/
  if (minsBetweenSubmissionAndFreeze > 60 || secsBetweenSubmissionAndFreeze < 0)
    return "";

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
          {secsBetweenSubmissionAndFreeze < 300
            ? `${secsBetweenSubmissionAndFreeze} second${
                secsBetweenSubmissionAndFreeze !== 1 && "s"
              }`
            : `${minsBetweenSubmissionAndFreeze} minute${
                minsBetweenSubmissionAndFreeze !== 1 && "s"
              }`}{" "}
          before predictions froze.
        </p>
      </>
    </Panel>
  );
};
