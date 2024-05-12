import { formatArrayIntoList, bringCurrUserToFrontOfArr } from "@lib/misc";

import {
  MostUpdatedPredictionUserIds,
  UserGameDataMap,
  UserGameData,
} from "@custom-types/game-types";

interface Props {
  mostUpdatedPredictionUserIds: MostUpdatedPredictionUserIds;
  currUser: UserGameData | null;
  users: UserGameDataMap;
}

export const MostUpdated = ({
  mostUpdatedPredictionUserIds,
  currUser,
  users,
}: Props) => {
  const mostUpdatedPredictionUsers = mostUpdatedPredictionUserIds.map(
    (userId) => users[userId]
  );

  const currUserMostUpdated =
    currUser && mostUpdatedPredictionUserIds.includes(currUser.userId);

  /**If the current user was one of those who updated their predictions the most, move them to the front of the arr*/
  if (currUserMostUpdated) {
    mostUpdatedPredictionUsers.unshift(
      mostUpdatedPredictionUsers.splice(
        mostUpdatedPredictionUsers.findIndex(
          (user) => user.userId === currUser.userId
        ),
        1
      )[0]
    );
  }

  return (
    <>
      <h2>Most Updated Predictions</h2>
      {currUser !== null &&
        typeof currUser.timesPredictionsUpdated === "number" &&
        !currUserMostUpdated && (
          <>
            <p>
              {currUser.timesPredictionsUpdated > 1
                ? `You updated your predictions ${currUser.timesPredictionsUpdated} times`
                : "You only submitted your predictions once"}
              .
            </p>
            <hr />
          </>
        )}
      <p>
        {`${formatArrayIntoList(
          bringCurrUserToFrontOfArr(currUser, mostUpdatedPredictionUsers).map(
            (user) => {
              if (!user.displayName) throw new Error();
              if (user.userId === currUser?.userId) {
                return "You";
              }
              return user.displayName;
            }
          )
        )} updated ${
          currUserMostUpdated ? "your" : "their"
        } predictions more than anyone else at ${
          mostUpdatedPredictionUsers[0].timesPredictionsUpdated
        } times.`}
      </p>
    </>
  );
};
