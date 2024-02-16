"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { Leaderboard } from "./leaderboard";
import { PredictionTable } from "@components/prediction-table/prediction-table";
import { StandingsTable } from "@components/prediction-table/standings-table";
import { RoundSlider } from "@components/round-slider/round-slider";
import { Button } from "@components/button/button";

import styles from "@components/game/game-container.module.scss";

import { Round, Users, User } from "@custom-types/game-types";

interface Props {
  currentUserDisplayName: string | null;
  lastUpdated: Date;
  rounds: Round[];
  season: string;
  users: Users;
}

export const GameContainer = ({
  rounds,
  lastUpdated,
  users,
  currentUserDisplayName,
  season,
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const selectedUserSetter = (displayName: string | null): User => {
    return displayName && users[displayName]
      ? users[displayName]
      : rounds[roundIndex].leaderboards[0].user;
  };

  const [mode, setMode] = useState("leaderboard");
  const [roundIndex, setRoundIndex] = useState(rounds.length - 1);
  const [selectedUser, setSelectedUser] = useState(
    selectedUserSetter(currentUserDisplayName)
  );
  useEffect(() => {
    /** Whenever back or forwards button is pressed, change to the appropriate mode*/
    const userSearchParam = searchParams.get("user");
    window.onpopstate = () => {
      if (userSearchParam) {
        setMode("table");
        setSelectedUser(selectedUserSetter(userSearchParam));
      } else {
        setMode("leaderboard");
      }
    };
    if (userSearchParam) {
      setMode("table");
      setSelectedUser(selectedUserSetter(userSearchParam));
    } else {
      setMode("leaderboard");
    }
  }, [pathname, searchParams]);

  const changeRoundHandler = (newRoundIndex: number) => {
    setRoundIndex(newRoundIndex);
  };
  const changeSelectedUserHandler = (displayName: string) => {
    router.push(pathname + `?user=${displayName}`);
    setSelectedUser(selectedUserSetter(displayName));
    setMode("table");
  };

  /**@todo URGENT Fix duplicating users bug */
  return (
    <>
      <div
        className={`${styles.con} ${
          mode === "leaderboard" ? styles.leaderboard_mode : styles.table_mode
        }`}>
        {mode === "leaderboard" ? (
          <>
            <div className={styles.main}>
              <h1>Formula 1 {season} - Leaderboard</h1>
              <p>
                Select users to view their predictions and compare them to the
                actual standings.
              </p>
              <Leaderboard
                lastUpdated={lastUpdated}
                rounds={rounds}
                roundIndex={roundIndex}
                changeSelectedUserHandler={changeSelectedUserHandler}
              />
            </div>
            <StandingsTable
              className={styles.standings_table}
              selectedRound={roundIndex}
              standingsArr={rounds[roundIndex].standings}
            />
          </>
        ) : (
          <>
            <div className={styles.options}>
              <Button
                onClick={() => {
                  setMode("leaderboard");
                  router.push(pathname);
                }}>
                Back
              </Button>
              {selectedUser.information ? (
                <p>Note: {selectedUser.information}</p>
              ) : (
                ""
              )}
              {/**@todo Add report display name feature 
              <Button>Report Display Name</Button>*/}
            </div>
            <div className={styles.tables}>
              <PredictionTable
                selectedRound={roundIndex}
                selectedUser={selectedUser}
              />
              <StandingsTable
                selectedRound={roundIndex}
                standingsArr={rounds[roundIndex].standings}
                className={styles.standings_table}
              />
            </div>
          </>
        )}
      </div>
      {rounds.length > 0 && (
        <RoundSlider
          selectedRound={roundIndex}
          noOfRounds={rounds.length}
          trackName={rounds[roundIndex].trackName}
          changeRound={changeRoundHandler}
        />
      )}
    </>
  );
};
