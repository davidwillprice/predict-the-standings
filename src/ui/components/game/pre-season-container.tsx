"use client";

import { useState } from "react";

import { PreseasonLeaderboard } from "@components/game/pre-season-leaderboard";
import { PreSeasonPredictionTable } from "@components/prediction-table/pre-season-prediction-table";

import { Users, User } from "@custom-types/game-types";

import styles from "@components/game/game-container.module.scss";

interface Props {
  users: Users;
}

export const PreSeasonContainer = ({ users }: Props) => {
  const [selectedUser, setSelectedUser] = useState<User>();
  const changeSelectedUserHandler = (displayName: string) => {
    setSelectedUser(users[displayName]);
  };
  {
    /**@todo Create alternative UI for when there are no predictions  */
  }
  return (
    <div className={styles.con}>
      <PreseasonLeaderboard
        users={users}
        changeSelectedUserHandler={changeSelectedUserHandler}
      />
      {selectedUser ? (
        <PreSeasonPredictionTable selectedUser={selectedUser} />
      ) : (
        ""
      )}
    </div>
  );
};
