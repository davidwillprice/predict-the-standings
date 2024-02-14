"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { PreseasonLeaderboard } from "@components/game/pre-season-leaderboard";

import { Users, User } from "@custom-types/game-types";

import styles from "@components/game/game-container.module.scss";

interface Props {
  users: Users;
}

export const PreSeasonContainer = ({ users }: Props) => {
  //   const selectedUserSetter = (displayName: string | null): User => {
  //     return displayName && users[displayName]
  //       ? users[displayName]
  //       : rounds[roundIndex].leaderboards[0].user;
  //   };

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  //   const [selectedUser, setSelectedUser] = useState(
  //     selectedUserSetter(currentUserDisplayName)
  //   );
  const changeSelectedUserHandler = (displayName: string) => {
    console.log("test");
    // router.push(pathname + `?user=${displayName}`);
    // setSelectedUser(selectedUserSetter(displayName));
  };
  return (
    <div className={styles.con}>
      <PreseasonLeaderboard
        users={users}
        changeSelectedUserHandler={changeSelectedUserHandler}
      />
    </div>
  );
};
