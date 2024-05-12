import { formatArrayIntoList, bringCurrUserToFrontOfArr } from "@lib/misc";

import {
  ControversialUserIds,
  UserGameDataMap,
  UserGameData,
} from "@custom-types/game-types";

interface Props {
  controversialUserIds: ControversialUserIds;
  currUser: UserGameData | null;
  users: UserGameDataMap;
}

export const Controversy = ({
  controversialUserIds,
  currUser,
  users,
}: Props) => {
  class MostOrLeastControData {
    users: UserGameData[];
    difFromAvg: number;
    controType: "most" | "least";
    entrantType: string;
    constructor(
      users: UserGameData[],
      controType: "most" | "least",
      entrantType: string
    ) {
      this.users = users;
      this.controType = controType;
      this.difFromAvg = users[0].predictionsFromAvg[entrantType];
      this.entrantType = entrantType;
    }
  }

  const isMultiEntrantTypes = Object.keys(controversialUserIds).length > 1;

  //**Create an array of controversy stats, one for each entrant type and their most/least contro players */
  let mostOrLeastControPlayers = [];
  for (const entrantType of Object.keys(controversialUserIds)) {
    //**Convert the arr of most contro userIds into user data */
    const mostControUsers = controversialUserIds[entrantType].most.map(
      (userId) => users[userId]
    );
    //**Convert the arr of least contro userIds into user data */
    const leastControUsers = controversialUserIds[entrantType].least.map(
      (userId) => users[userId]
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
      <h2>Controversial Predictions</h2>
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
          const { users, difFromAvg, controType, entrantType } = userData;

          return (
            <li key={controType + entrantType}>
              {`${formatArrayIntoList(
                bringCurrUserToFrontOfArr(currUser, users).map((user) => {
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
