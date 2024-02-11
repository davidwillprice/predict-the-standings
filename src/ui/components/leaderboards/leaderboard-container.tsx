"use client";

import { useState } from "react";

import { Leaderboard } from "./leaderboard";
import { PredictionTable } from "@components/predicition-table/prediction-table";
import { RoundSlider } from "@components/round-slider/round-slider";

import styles from "@components/leaderboards/leaderboard.module.scss";

import { Round, Users } from "@custom-types/game-types";

interface Props {
  currentUserDisplayName: string | null;
  rounds: Round[];
  users: Users;
}

export const LeaderboardContainer = ({
  rounds,
  users,
  currentUserDisplayName,
}: Props) => {
  const [roundIndex, setRoundIndex] = useState(rounds.length - 1);
  const [highlightedUser, setHighlightedUser] = useState(
    rounds[roundIndex].leaderboards.find(
      (leaderboard) => leaderboard.user.displayName === currentUserDisplayName
    ) || rounds[roundIndex].leaderboards[0]
  );

  const changeRoundHandler = (newRoundIndex: number) => {
    setRoundIndex(newRoundIndex);
  };
  /**@todo URGENT Fix duplicating users bug */
  return (
    <>
      <div className={styles.con}>
        <Leaderboard rounds={rounds} roundIndex={roundIndex} />
        <PredictionTable
          selectedRound={roundIndex}
          userLeaderboard={highlightedUser}
        />
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
