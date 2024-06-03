import { formatArrayIntoList, bringCurrUserToFrontOfArr } from "@lib/misc";

import {
  MostUpdatedGameDataIdArr,
  GameDataMap,
  UserGameData,
} from "@custom-types/game-types";

interface Props {
  mostUpdatedGameDataIdArr: MostUpdatedGameDataIdArr;
  currUser: UserGameData | null;
  gameDataMap: GameDataMap;
}

export const MostUpdated = ({
  mostUpdatedGameDataIdArr,
  currUser,
  gameDataMap,
}: Props) => {
  const mostUpdatedPredictionUsers = mostUpdatedGameDataIdArr.map(
    (_id) => gameDataMap[_id]
  );

  const didCurrUserMostUpdate =
    currUser &&
    mostUpdatedGameDataIdArr.includes(
      typeof currUser._id === "string" ? currUser._id : currUser._id.toString()
    );

  /**If the current user was one of those who updated their predictions the most, move them to the front of the arr*/
  if (didCurrUserMostUpdate) {
    mostUpdatedPredictionUsers.unshift(
      mostUpdatedPredictionUsers.splice(
        mostUpdatedPredictionUsers.findIndex(
          (user) => user._id === currUser._id
        ),
        1
      )[0]
    );
  }

  return (
    <>
      <h2>Indecisive</h2>
      {currUser !== null &&
        typeof currUser.timesPredictionsUpdated === "number" &&
        !didCurrUserMostUpdate && (
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
        )} updated ${didCurrUserMostUpdate ? "your" : "their"} predictions ${
          mostUpdatedPredictionUsers[0].timesPredictionsUpdated
        } times, more than anyone else.`}
      </p>
    </>
  );
};
