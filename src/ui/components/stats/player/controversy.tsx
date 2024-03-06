import { formatArrayIntoList, calcPercentile } from "@lib/misc";

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

  class UserControData {
    difFromAvg: number;
    percentile: number;
    entrantType: string;
    constructor(difFromAvg: number, entrantType: string) {
      this.difFromAvg = difFromAvg;
      this.percentile = calcPercentile(
        controversyArrs[entrantType].map(
          (user) => user.predictionsFromAvg[entrantType]
        ),
        difFromAvg
      );
      this.entrantType = entrantType;
    }
  }
  const userControArr = [];
  if (currentUser) {
    for (const entrantType of Object.keys(currentUser.predictionsFromAvg)) {
      userControArr.push(
        new UserControData(
          currentUser.predictionsFromAvg[entrantType],
          entrantType
        )
      );
    }
  }

  {
    /**@todo "X, Y, and Z were the only players to predict Hamilton would win the WDC" */
  }
  return (
    <>
      <h2>Controversial Predictions</h2>
      {currentUser ? (
        <>
          <ul>
            {userControArr.map((data) => (
              <li key={data.entrantType}>
                You had{" "}
                {data.percentile < 20
                  ? "very safe"
                  : data.percentile < 60
                  ? "pretty safe"
                  : data.percentile < 80
                  ? "controversial"
                  : "very controversial"}{" "}
                {data.entrantType} predictions ({data.difFromAvg} position
                differences from the average predictions).
              </li>
            ))}
          </ul>
          <hr />
        </>
      ) : (
        ""
      )}
      <ul>
        {mostOrLeastControPlayers.map((userData) => {
          const { users, difFromAvg, controType, entrantType } = userData;
          return (
            <li key={controType + entrantType}>
              {`${formatArrayIntoList(
                users.map((user) => {
                  if (!user.displayName) throw new Error();
                  return user.displayName;
                })
              )} had the ${controType} 
            'controversial' ${entrantType} predictions (${difFromAvg} position differences from the average predictions).`}
            </li>
          );
        })}
      </ul>
    </>
  );
};
