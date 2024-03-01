import { Users, User } from "@custom-types/game-types";

interface Props {
  currentUserId: string | undefined;
  isSeasonOver: Boolean;
  users: Users;
}

export const Controversy = ({ currentUserId, isSeasonOver, users }: Props) => {
  let controversyArrs: { [key: string]: User[] } = {};

  //   const currentUser = currentUserId ? users.find((user)=> currentUserId === user.id);
  //   if

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

  return (
    <>
      <h2>Controversial Predictions</h2>
      <ul></ul>
    </>
  );
};
