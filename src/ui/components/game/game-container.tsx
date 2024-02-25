"use client";

import { useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { Leaderboard } from "./leaderboard";
import { PredictionTable } from "@components/prediction-table/prediction-table";
import { StandingsTable } from "@components/prediction-table/standings-table";
import { RoundSlider } from "@components/round-slider/round-slider";
import { Button } from "@components/button/button";

import styles from "@components/game/game-container.module.scss";

import { Round, Users, User } from "@custom-types/game-types";

interface Props {
  children: ReactNode;
  currentUserDisplayName: string | null;
  lastUpdated: Date;
  rounds: Round[];
  currentSearchParams: { [key: string]: string | string[] | undefined };
  users: Users;
}

export const GameContainer = ({
  children,
  rounds,
  lastUpdated,
  users,
  currentUserDisplayName,
  currentSearchParams,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  /**If searchParams have a valid round query, return it - Else default to latest round
   * @returns roundIndex number
   */
  const setInitialRounds = (searchParams: {
    [key: string]: string | string[] | undefined;
  }): number => {
    if (typeof searchParams.round === "string") {
      const round = Number(searchParams.round);
      if (
        Number.isInteger(Number(searchParams.round)) &&
        0 < round &&
        round <= rounds.length - 1
      ) {
        return round - 1;
      }
    }
    return rounds.length - 1;
  };

  /**If searchParams have a valid entrantType query, return it - Else default to driver
   * @returns entrantType string
   */
  const setInitialEntrantType = (searchParams: {
    [key: string]: string | string[] | undefined;
  }): string => {
    if (
      typeof searchParams.leaderboard === "string" &&
      searchParams.leaderboard === "constructors"
    )
      return "team";
    else {
      return "driver";
    }
  };

  /**If searchParams have a valid user query, return the User - Else default to null*/
  const setInitialUser = (searchParams: {
    [key: string]: string | string[] | undefined;
  }): User | null => {
    if (typeof searchParams.user === "string" && users[searchParams.user]) {
      return users[searchParams.user];
    } else {
      return null;
    }
  };

  const [roundIndex, setRoundIndex] = useState(
    setInitialRounds(currentSearchParams)
  );
  const [entrantType, setEntrantType] = useState(
    setInitialEntrantType(currentSearchParams)
  );
  /**@todo Probably need to readd "mode" state to allow for the current user to be automatically navigated to when pagination is added */
  const [selectedUser, setSelectedUser] = useState(
    setInitialUser(currentSearchParams)
  );

  useEffect(() => {
    setEntrantType(setInitialEntrantType(currentSearchParams));
    setRoundIndex(setInitialRounds(currentSearchParams));
    setSelectedUser(setInitialUser(currentSearchParams));
  }, [currentSearchParams]);

  /**Updates round in state and query string */
  const changeRoundHandler = (newRoundIndex: number) => {
    /**Uses router.replace() rather than router.push() as I don't want round chnages clogging up the user history */
    router.replace(
      pathname +
        "?" +
        createQueryString("round", (newRoundIndex + 1).toString())
    );
    setRoundIndex(newRoundIndex);
  };

  /**Updates user in state and query string */
  const changeSelectedUserHandler = (displayName: string) => {
    router.push(pathname + "?" + createQueryString("user", displayName));
    setSelectedUser(users[displayName]);
  };

  return (
    <>
      <div
        className={`${styles.con} ${
          selectedUser ? styles.table_mode : styles.leaderboard_mode
        }`}>
        {!selectedUser ? (
          <>
            <div className={styles.main}>
              {children}
              <Leaderboard
                entrantType={entrantType}
                lastUpdated={lastUpdated}
                rounds={rounds}
                roundIndex={roundIndex}
                changeSelectedUserHandler={changeSelectedUserHandler}
              />
            </div>
            <StandingsTable
              className={styles.standings_table}
              standingsArr={rounds[roundIndex].standings[entrantType]}
            />
          </>
        ) : (
          <>
            <div className={styles.options}>
              <Button
                onClick={() => {
                  setSelectedUser(null);
                  router.back();
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
                entrantType={entrantType}
                selectedRound={roundIndex}
                selectedUser={selectedUser}
              />
              <StandingsTable
                standingsArr={rounds[roundIndex].standings[entrantType]}
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
