"use client";

import { useState, useEffect, ReactNode, useRef, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import {
  getLeaderboardDataQuery,
  getSingleUserPredictionDataQuery,
  getStatsDataQuery,
} from "@lib/db-functions";
import { debounce } from "@lib/misc";

import { Leaderboard } from "./leaderboard";
import { PredictionTable } from "@components/prediction-table/prediction-table";
import { RoundSlider } from "@components/round-slider/round-slider";
import { LeaderboardSkeleton } from "./leaderboard-skeleton";
import { UserData } from "./user-data";
import { Button } from "@components/button/button";
import Icon from "@ui/svgs/icons/sq-icon";
import { EntrantTable } from "@components/entrant-table/entrant-table";

import btnStyles from "@components/button/button.module.scss";
import styles from "@components/game/game-container.module.scss";

import {
  LocalSeasonData,
  Round,
  UserGameDataMap,
  UserGameData,
} from "@custom-types/game-types";

interface Props {
  children: ReactNode;
  currentUserId: string | null;
  currentUserDisplayName: string | null;
  currentSearchParams: { [key: string]: string | string[] | undefined };
  lastUpdated: Date;
  localSeasonData: LocalSeasonData;
  rounds: Round[];
  season: string;
}

export const GameContainer = ({
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
  const usersPerPage = 15;

  const createQueryString = useCallback(
    (queryArr: { name: string; value: string }[]) => {
      const params = new URLSearchParams(searchParams.toString());
      queryArr.forEach((queryObj) => {
        params.set(queryObj.name, queryObj.value);
      });
      return params.toString();
    },
    [searchParams]
  );

  /**If searchParams have a valid round query, return it - Else default to latest round
   * @returns roundIndex number
   */
  const getInitialRounds = (searchParams: {
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

  const getInitialEntrantType = (searchParams: {
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

  const getInitialPage = (searchParams: {
    [key: string]: string | string[] | undefined;
  }): number => {
    return typeof searchParams.page === "string" && +searchParams.page > 0
      ? +searchParams.page
      : 1;
  };

  const [roundIndex, setRoundIndex] = useState(
    getInitialRounds(currentSearchParams)
  );
  const [entrantType, setEntrantType] = useState(
    getInitialEntrantType(currentSearchParams)
  );
  const [page, setPage] = useState<number>(getInitialPage(currentSearchParams));
  const [selectedUser, setSelectedUser] = useState<UserGameData | null>(null);
  const [usersData, setUsersData] = useState<UserGameDataMap | null>(null);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const noOfPredictions = useRef<null | number>(null);
  const currUserGameData = useRef<null | UserGameData>(null);

  const handleBackBtn = () => {
    setSelectedUser(null);
  };

  /**UseEffect that only runs once on page load */
  useEffect(() => {
    if (currentUserId) {
      const getCurrUserGameData = async () => {
        currUserGameData.current = await getSingleUserPredictionDataQuery(
          season,
          competitionStrs.shortHand,
          currentUserId
        );
      };
      getCurrUserGameData();
    }
  }, [season, competitionStrs.shortHand, currentUserId]);

  /**useEffect that only runs when the query strings change
   * @todo Fix this seeming to run more than once after a page load and it is causing multiple unnecessary DB calls
   */
  useEffect(() => {
    const newPage = getInitialPage(currentSearchParams);
    const newEntrantType = getInitialEntrantType(currentSearchParams);
    const newRoundIndex = getInitialRounds(currentSearchParams);
    setEntrantType(newEntrantType);
    setRoundIndex(newRoundIndex);
    setPage(newPage);

    const getData = async () => {
      const getNoOfPredictions = async () => {
        try {
          const res = await getStatsDataQuery(
            season,
            competitionStrs.shortHand
          );
          noOfPredictions.current = res.noOfPredictions[newEntrantType];
        } catch (err) {
          throw err;
        }
      };

      const updateUserData = async () => {
        try {
          const res = await getLeaderboardDataQuery(
            competitionStrs.shortHand,
            newEntrantType,
            noOfPredictions.current,
            newPage,
            newRoundIndex,
            season,
            usersPerPage
          );

          setUsersData(res);

          if (typeof currentSearchParams.user === "string") {
            /**If the searchParams have a valid user query, set it as the selected User*/
            if (res[currentSearchParams.user])
              setSelectedUser(res[currentSearchParams.user]);
            /**Else if it is the current user's Id in the params, use their data for the selected user */ else if (
              currUserGameData.current !== null &&
              currUserGameData.current.userId === currentSearchParams.user
            )
              setSelectedUser(currUserGameData.current);
          }
        } catch (err) {
          throw err;
        }
      };
      await getNoOfPredictions();
      await updateUserData();
    };
    getData();
  }, [currentSearchParams]);

  const updateRoundQueryString = (newRoundIndex: number) => {
    /**Cancel loading skeleton UI*/
    setIsDebouncing(false);
    /**Uses router.replace() rather than router.push() as I don't want round chnages clogging up the user history */
    router.replace(
      pathname +
        "?" +
        createQueryString([
          { name: "round", value: (newRoundIndex + 1).toString() },
        ])
    );
  };

  /**Updates round in query string, but only if this function isn't triggered again within 500ms */
  const changeRoundHandler = debounce(updateRoundQueryString, 500);

  /**Enables loading skeleton UI while slider is debouncing*/
  const addDebouncingState = () => {
    setIsDebouncing(true);
  };

  /**Updates entrantType in query string - F1 only currently */
  const changeEntrantTypeHandler = () => {
    const newEntrantType = entrantType === "teams" ? "drivers" : "constructors";
    router.push(
      pathname +
        "?" +
        createQueryString([{ name: "leaderboard", value: newEntrantType }])
    );
  };

  /**Updates user in query string */
  const changeSelectedUserHandler = (userGameData: UserGameData) => {
    /**@todo Fix 'back' function not working */
    router.push(
      pathname +
        "?" +
        createQueryString([
          { name: "user", value: userGameData.userId },
          {
            name: "page",
            value: Math.ceil(
              userGameData.season[entrantType][roundIndex].leaderboardPos /
                usersPerPage
            ).toString(),
          },
        ])
    );
  };

  /**Updates page in query string */
  const changePageHandler = (page: number) => {
    router.replace(
      pathname +
        "?" +
        createQueryString([{ name: "page", value: page.toLocaleString() }])
    );
  };

  const standingsArr = rounds[roundIndex].standings[entrantType].map(
    (entrant) => allEntrants[entrantType][entrant]
  );

  const standingsTable = (
    <div id="standings-table" className={styles.standings_table}>
      <EntrantTable
        entrantArr={standingsArr}
        heading={"Actual Standings"}
        shortHandCompStr={competitionStrs.shortHand}
      />
    </div>
  );

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
              {usersData &&
              noOfPredictions.current !== null &&
              !isDebouncing ? (
                <Leaderboard
                  changePageHandler={changePageHandler}
                  changeSelectedUserHandler={changeSelectedUserHandler}
                  currUserGameData={currUserGameData.current}
                  entrantType={entrantType}
                  isSeasonOver={isSeasonOver}
                  lastUpdated={lastUpdated}
                  noOfPredictions={noOfPredictions.current}
                  page={page}
                  rounds={rounds}
                  roundIndex={roundIndex}
                  users={usersData}
                  usersPerPage={usersPerPage}
                />
              ) : (
                <LeaderboardSkeleton usersPerPage={usersPerPage} />
              )}
            </div>
            {standingsTable}
          </>
        ) : (
          <>
            <UserData
              currentUserDisplayName={currentUserDisplayName}
              currentUserId={currentUserId}
              entrantType={entrantType}
              handleBackBtn={handleBackBtn}
              isSeasonOver={isSeasonOver}
              moreThanOneRound={rounds.length !== 1}
              roundIndex={roundIndex}
              selectedUser={selectedUser}
            />
            <div className={styles.tables}>
              <PredictionTable
                currentUserDisplayName={currentUserDisplayName}
                currentUserId={currentUserId}
                entrants={allEntrants[entrantType]}
                entrantType={entrantType}
                round={rounds[roundIndex]}
                roundIndex={roundIndex}
                selectedUser={selectedUser}
                shortHandCompStr={competitionStrs.shortHand}
              />
              {standingsTable}
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
            addDebouncingState={addDebouncingState}
            changeRound={changeRoundHandler}
            initialRoundIndex={roundIndex}
            rounds={rounds}
            shortHandCompStr={competitionStrs.shortHand}
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
