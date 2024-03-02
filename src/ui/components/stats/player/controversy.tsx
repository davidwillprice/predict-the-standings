import { formatArrayIntoList } from "@lib/misc";

import { Users, User } from "@custom-types/game-types";

interface Props {
  currentUserId: string | undefined;
  isSeasonOver: Boolean;
  users: Users;
}

export const Controversy = ({ currentUserId, isSeasonOver, users }: Props) => {
  let controversyArrs: { [key: string]: User[] } = {};

  const currentUser: User | undefined = users["user" + currentUserId];

  class MostOrLeastControData {
    users: User[];
    difFromAvg: number;
    controType: "most" | "least";
    entrantType: string;
    constructor(
      users: User[],
      controType: "most" | "least",
      entrantType: string
    ) {
      this.users = users;
      this.controType = controType;
      this.difFromAvg = users[0].predictionsFromAvg[entrantType];
      this.entrantType = entrantType;
    }
  }

  /**Populate controversyArrs with the users in any order */
  for (const user of Object.values(users)) {
    if (user.displayName === "Average") continue;
    for (const entrantType in user.predictions) {
      if (!controversyArrs[entrantType]) controversyArrs[entrantType] = [];
      controversyArrs[entrantType].push(user);
    }
  }

  /**Order controversyArrs by how controversial they are */
  for (const entrantType in controversyArrs) {
    controversyArrs[entrantType].sort((a, b) =>
      a.predictionsFromAvg[entrantType]! > b.predictionsFromAvg[entrantType]!
        ? 1
        : -1
    );
  }

  let mostOrLeastControPlayers = [];
  for (const [entrantType, userArr] of Object.entries(controversyArrs)) {
    const mostControPlayers = userArr.filter(
      (user) =>
        user.predictionsFromAvg[entrantType] ===
        userArr[userArr.length - 1].predictionsFromAvg[entrantType]
    );

    mostOrLeastControPlayers.push(
      new MostOrLeastControData(mostControPlayers, "most", entrantType)
    );

    const leastControPlayers = userArr.filter(
      (user) =>
        user.predictionsFromAvg[entrantType] ===
        userArr[0].predictionsFromAvg[entrantType]
    );
    mostOrLeastControPlayers.push(
      new MostOrLeastControData(leastControPlayers, "least", entrantType)
    );
  }
  console.log(mostOrLeastControPlayers);
  /**@todo Add logged in users controversy */

  return (
    <>
      <h2>Most and Least Controversial Players</h2>
      <ul>
        {mostOrLeastControPlayers.map((userData) => {
          const { users, difFromAvg, controType, entrantType } = userData;
          return (
            <li key={controType + entrantType}>
              {`${formatArrayIntoList(
                users.map((user) => user.displayName)
              )} had the ${controType} 
            'controversial' ${entrantType} predictions (${difFromAvg} position differences from the average predictions).`}
            </li>
          );
        })}
      </ul>
    </>
  );
};
