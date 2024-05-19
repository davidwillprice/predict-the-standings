"use client";

import { useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { getLeaderboardDataQuery } from "@lib/db-functions";

import { Leaderboard } from "./leaderboard";
import { PredictionTable } from "@components/prediction-table/prediction-table";
import { StandingsTable } from "@components/prediction-table/standings-table";
import { RoundSlider } from "@components/round-slider/round-slider";
import { LeaderboardSkeleton } from "./leaderboard-skeleton";
import { UserData } from "./user-data";
import { Button } from "@components/button/button";
import Icon from "@ui/svgs/icons/sq-icon";

import btnStyles from "@components/button/button.module.scss";
import styles from "@components/game/game-container.module.scss";

import {
  LocalSeasonData,
  Round,
  ShortHandCompStr,
  UserGameDataMap,
  UserGameData,
} from "@custom-types/game-types";

interface Props {
  children: ReactNode;
  competition: ShortHandCompStr;
  currentUserId: string | null;
  currentUserDisplayName: string | null;
  currentSearchParams: { [key: string]: string | string[] | undefined };
  lastUpdated: Date;
  localSeasonData: LocalSeasonData;
  rounds: Round[];
  season: string;
}

export const GameContainer = ({
  competition,
  children,
  currentUserId,
  currentUserDisplayName,
  currentSearchParams,
  lastUpdated,
  localSeasonData,
  rounds,
  season,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { allEntrants, competitionStrs, isSeasonOver } = localSeasonData;

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

  const [roundIndex, setRoundIndex] = useState(
    setInitialRounds(currentSearchParams)
  );

  /**If searchParams have a valid entrantType query, return it - Else default to driver
   * @returns entrantType string
   */
  const setInitialEntrantType = (searchParams: {
    [key: string]: string | string[] | undefined;
  }): string => {
    const entrantTypeArr = Object.keys(allEntrants);
    /**If there is only one entrant type, just use that */
    if (entrantTypeArr.length === 1) return entrantTypeArr[0];

    if (
      typeof searchParams.leaderboard === "string" &&
      searchParams.leaderboard === "constructors"
    )
      return competitionStrs.shortHand === "f1" ? "teams" : entrantTypeArr[0];
    else {
      return competitionStrs.shortHand === "f1" ? "drivers" : entrantTypeArr[0];
    }
  };
  const [entrantType, setEntrantType] = useState(
    setInitialEntrantType(currentSearchParams)
  );
  /**@todo Probably need to readd "mode" state to allow for the current user to be automatically navigated to when pagination is added */
  const [selectedUser, setSelectedUser] = useState<UserGameData | null>(null);
  const [usersData, setUsersData] = useState<UserGameDataMap | null>(null);

  const handleBackBtn = () => {
    setSelectedUser(null);
  };

  useEffect(() => {
    setEntrantType(setInitialEntrantType(currentSearchParams));
    setRoundIndex(setInitialRounds(currentSearchParams));

    const updateUserData = async () => {
      try {
        const res = await getLeaderboardDataQuery(
          competition,
          entrantType,
          roundIndex,
          season
        );

        setUsersData(res);

        /**If the searchParams have a valid user query, set it as the selected User*/
        if (
          typeof currentSearchParams.user === "string" &&
          res[currentSearchParams.user]
        )
          setSelectedUser(res[currentSearchParams.user]);
      } catch (err) {
        throw err;
      }
    };

    updateUserData();
  }, [currentSearchParams]);

  /**Updates round in query string */
  const changeRoundHandler = (newRoundIndex: number) => {
    /**Uses router.replace() rather than router.push() as I don't want round chnages clogging up the user history */
    /**@todo Consider shallow routing? */
    router.replace(
      pathname +
        "?" +
        createQueryString("round", (newRoundIndex + 1).toString())
    );
  };

  /**Updates entrantType in query string - F1 only currently */
  const changeEntrantTypeHandler = () => {
    const newEntrantType = entrantType === "teams" ? "drivers" : "constructors";
    router.push(
      pathname + "?" + createQueryString("leaderboard", newEntrantType)
    );
  };

  /**Updates user in query string */
  const changeSelectedUserHandler = (userId: string) => {
    router.push(pathname + "?" + createQueryString("user", userId));
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
              {usersData ? (
                <Leaderboard
                  changeSelectedUserHandler={changeSelectedUserHandler}
                  currentUserDisplayName={currentUserDisplayName}
                  currentUserId={currentUserId}
                  entrantType={entrantType}
                  isSeasonOver={isSeasonOver}
                  lastUpdated={lastUpdated}
                  rounds={rounds}
                  roundIndex={roundIndex}
                  users={usersData}
                />
              ) : (
                <LeaderboardSkeleton />
              )}
            </div>
            <StandingsTable
              className={styles.standings_table}
              competition={competition}
              entrants={allEntrants[entrantType]}
              standingsArr={rounds[roundIndex].standings[entrantType]}
            />
          </>
        ) : (
          <>
            <UserData
              currentUserDisplayName={currentUserDisplayName}
              currentUserId={currentUserId}
              entrantType={entrantType}
              handleBackBtn={handleBackBtn}
              roundIndex={roundIndex}
              selectedUser={selectedUser}
            />
            <div className={styles.tables}>
              <PredictionTable
                competition={competition}
                currentUserDisplayName={currentUserDisplayName}
                currentUserId={currentUserId}
                entrants={allEntrants[entrantType]}
                entrantType={entrantType}
                selectedRound={roundIndex}
                selectedUser={selectedUser}
              />
              <StandingsTable
                className={styles.standings_table}
                competition={competition}
                entrants={allEntrants[entrantType]}
                standingsArr={rounds[roundIndex].standings[entrantType]}
              />
            </div>
          </>
        )}
      </div>
      {
        //**Don't show the round slider if there is no round data or if there is only one round total in the season */
        rounds.length === 0 || (rounds.length === 1 && isSeasonOver) ? (
          ""
        ) : (
          <RoundSlider
            selectedRound={roundIndex}
            noOfRounds={rounds.length}
            trackName={rounds[roundIndex].trackName}
            changeRound={changeRoundHandler}
          />
        )
      }
      {competitionStrs.shortHand === "f1" && (
        <Button
          className={`${btnStyles.button} ${styles.switchEntrantTypeBtn}`}
          onClick={changeEntrantTypeHandler}>
          <Icon
            type={entrantType === "teams" ? "driver" : "f1"}
            strokeWidth={2}
          />
          Switch to {entrantType === "team" ? "Drivers" : "Constructors"}{" "}
          Leaderboard
        </Button>
      )}
    </>
  );
};
