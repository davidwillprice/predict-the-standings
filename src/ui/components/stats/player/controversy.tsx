import { Users, User } from "@custom-types/game-types";

interface Props {
  currentUserId: string | undefined;
  isSeasonOver: Boolean;
  users: Users;
}

export const Controversy = ({ currentUserId, isSeasonOver, users }: Props) => {
  let controversyArrs: { [key: string]: User[] } = {};

  const currentUser: User | undefined = users["user" + currentUserId];

  class MostOrLeastControPlayer {
    user: User;
    difFromAvg: number;
    controType: "most" | "least";
    entrantType: string;
    constructor(user: User, controType: "most" | "least", entrantType: string) {
      this.user = user;
      this.controType = controType;
      this.difFromAvg = user.predictionsFromAvg[entrantType];
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
  /**@todo Account for multiple users having the same level of controversy */
  let mostOrLeastControPlayers = [];
  for (const [entrantType, userArr] of Object.entries(controversyArrs)) {
    mostOrLeastControPlayers.push(
      new MostOrLeastControPlayer(
        userArr[userArr.length - 1],
        "most",
        entrantType
      )
    );
    mostOrLeastControPlayers.push(
      new MostOrLeastControPlayer(userArr[0], "least", entrantType)
    );
  }

  /**@todo Add logged in users controversy */

  return (
    <>
      <h2>Most and Least Controversial Players</h2>
      <ul>
        {mostOrLeastControPlayers.map((userData) => {
          const { user, difFromAvg, controType, entrantType } = userData;
          return (
            <li key={user.id}>
              {`${user.displayName} had the ${controType} 
            'controversial' ${entrantType} predictions (${difFromAvg} position differences from the average predictions).`}
            </li>
          );
        })}
      </ul>
    </>
  );
};
