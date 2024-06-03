import { formatArrayIntoList, bringCurrUserToFrontOfArr } from "@lib/misc";

import {
  ControversialGameDataIdMap,
  GameDataMap,
  UserGameData,
} from "@custom-types/game-types";

interface Props {
  controversialGameDataIdMap: ControversialGameDataIdMap;
  currUser: UserGameData | null;
  gameDataMap: GameDataMap;
}

export const Controversy = ({
  controversialGameDataIdMap,
  currUser,
  gameDataMap,
}: Props) => {
  class MostOrLeastControData {
    gameDataMap: UserGameData[];
    difFromAvg: number;
    controType: "most" | "least";
    entrantType: string;
    constructor(
      gameDataMap: UserGameData[],
      controType: "most" | "least",
      entrantType: string
    ) {
      this.gameDataMap = gameDataMap;
      this.controType = controType;
      this.difFromAvg = gameDataMap[0].predictionsFromAvg[entrantType];
      this.entrantType = entrantType;
    }
  }

  const isMultiEntrantTypes =
    Object.keys(controversialGameDataIdMap).length > 1;

  //**Create an array of controversy stats, one for each entrant type and their most/least contro players */
  let mostOrLeastControPlayers = [];
  for (const entrantType of Object.keys(controversialGameDataIdMap)) {
    //**Convert the arr of most contro gameData _id's into actual user game data */
    const mostControUsers = controversialGameDataIdMap[entrantType].most.map(
      (_id) => gameDataMap[_id]
    );
    //**Convert the arr of least contro gameData _id's into actual user game data */
    const leastControUsers = controversialGameDataIdMap[entrantType].least.map(
      (_id) => gameDataMap[_id]
    );
    mostOrLeastControPlayers.push(
      new MostOrLeastControData(mostControUsers, "most", entrantType)
    );
    mostOrLeastControPlayers.push(
      new MostOrLeastControData(leastControUsers, "least", entrantType)
    );
  }

  return (
    <>
      <h2>Controversy</h2>
      {currUser && (
        <>
          <ul>
            {Object.keys(currUser.predictions).map((entrantType) => (
              <li key={entrantType}>
                You had{" "}
                {currUser.controversyPercentile[entrantType] < 20
                  ? "very safe"
                  : currUser.controversyPercentile[entrantType] < 60
                  ? "pretty safe"
                  : currUser.controversyPercentile[entrantType] < 80
                  ? "controversial"
                  : "very controversial"}{" "}
                {isMultiEntrantTypes ? entrantType : ""} predictions (
                {currUser.predictionsFromAvg[entrantType]} position differences
                from the average predictions).
              </li>
            ))}
          </ul>
          <hr />
        </>
      )}
      <ul>
        {mostOrLeastControPlayers.map((userData) => {
          const { gameDataMap, difFromAvg, controType, entrantType } = userData;

          return (
            <li key={controType + entrantType}>
              {`${formatArrayIntoList(
                bringCurrUserToFrontOfArr(currUser, gameDataMap).map((user) => {
                  if (!user.displayName) throw new Error();
                  if (user.userId === currUser?.userId) {
                    return "You";
                  }
                  return user.displayName;
                })
              )} had the ${controType} 
            'controversial' ${
              isMultiEntrantTypes ? entrantType : ""
            } predictions (${difFromAvg} position differences from the average predictions).`}
            </li>
          );
        })}
      </ul>
    </>
  );
};
