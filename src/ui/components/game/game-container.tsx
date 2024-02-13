"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { Leaderboard } from "./leaderboard";
import { PredictionTable } from "@components/prediction-table/prediction-table";
import { StandingsTable } from "@components/prediction-table/standings-table";
import { RoundSlider } from "@components/round-slider/round-slider";
import { Button } from "@components/button/button";

import styles from "@components/game/game-container.module.scss";

import { Round, Users } from "@custom-types/game-types";

interface Props {
  currentUserDisplayName: string | null;
  rounds: Round[];
  users: Users;
}

export const GameContainer = ({
  rounds,
  users,
  currentUserDisplayName,
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [mode, setMode] = useState("leaderboard");
  const [roundIndex, setRoundIndex] = useState(rounds.length - 1);
  const [selectedUser, setSelectedUser] = useState(
    rounds[roundIndex].leaderboards.find(
      (leaderboard) => leaderboard.user.displayName === currentUserDisplayName
    ) || rounds[roundIndex].leaderboards[0]
  );

  useEffect(() => {
    /** Whenever the page changes*/
    console.log(searchParams.has("user"));
    window.onpopstate = () => {
      if (searchParams.has("user")) {
        setMode("table");
      } else {
        setMode("leaderboard");
      }
    };
    if (searchParams.has("user")) {
      setMode("table");
    } else {
      setMode("leaderboard");
    }
  }, [pathname, searchParams]);

  const changeRoundHandler = (newRoundIndex: number) => {
    setRoundIndex(newRoundIndex);
  };
  const changeSelectedUserHandler = (displayName: string) => {
    /**@todo If there is no query string to select a user, automatically select the user's data. And if they aren't signed in default to showing the person in first */
    router.push(pathname + `?user=${displayName}`);
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
              <p>
                Select users to view their predictions and compare them to the
                actual standings.
              </p>
              <Leaderboard
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
                }}>
                Back
              </Button>
              {/**@todo Add report display name feature 
              <Button>Report Display Name</Button>*/}
            </div>
            <div className={styles.tables}>
              <PredictionTable
                selectedRound={roundIndex}
                userLeaderboard={selectedUser}
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
