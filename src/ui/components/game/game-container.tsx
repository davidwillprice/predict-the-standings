"use client";

import { useState } from "react";

import { Leaderboard } from "./leaderboard";
import { PredictionTable } from "@components/predicition-table/prediction-table";
import { RoundSlider } from "@components/round-slider/round-slider";

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
  const [mode, setMode] = useState("table");
  const [roundIndex, setRoundIndex] = useState(rounds.length - 1);
  const [selectedUser, setSelectedUser] = useState(
    rounds[roundIndex].leaderboards.find(
      (leaderboard) => leaderboard.user.displayName === currentUserDisplayName
    ) || rounds[roundIndex].leaderboards[0]
  );

  const changeRoundHandler = (newRoundIndex: number) => {
    setRoundIndex(newRoundIndex);
  };
  const changeSelectedUser = () => {
    /**@todo If there is no query string to select a user, automatically select the user's data. And if they aren't signed in default to showing the person in first */
  };
  /**@todo URGENT Fix duplicating users bug */
  return (
    <>
      <div className={styles.con}>
        {mode === "leaderboard" ? (
          <Leaderboard rounds={rounds} roundIndex={roundIndex} />
        ) : (
          <PredictionTable
            selectedRound={roundIndex}
            userLeaderboard={selectedUser}
          />
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
