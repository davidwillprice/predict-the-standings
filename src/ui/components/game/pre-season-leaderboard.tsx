import { sortUsersAlphabetically } from "@lib/misc";

import { Users } from "@custom-types/game-types";

import styles from "@components/game/leaderboard.module.scss";
import predictStyles from "@components/prediction-table/prediction-table.module.scss";

interface Props {
  changeSelectedUserHandler: Function;
  users: Users;
}

export const PreseasonLeaderboard = ({
  changeSelectedUserHandler,
  users,
}: Props) => {
  const userArr = sortUsersAlphabetically(Object.values(users));
  return (
    <div className={predictStyles.prediction_table}>
      <table className={styles.leaderboard}>
        <thead>
          <tr>
            <th className={styles.position}>Pos</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {userArr.map((user, index) => (
            <tr
              key={user.displayName}
              className={`${predictStyles.table_row} ${styles.table_row}`}
              onClick={() => changeSelectedUserHandler(user.displayName)}>
              <td className={styles.position}>{index + 1}</td>
              <td>{user.displayName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
