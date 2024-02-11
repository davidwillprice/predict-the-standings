"use client";

import { useState } from "react";

import { Leaderboard } from "./leaderboard";
import { RoundSlider } from "@components/round-slider/round-slider";

import { Round, Users } from "@custom-types/game-types";

interface Props {
  rounds: Round[];
  users: Users;
}

export const LeaderboardContainer = ({ rounds, users }: Props) => {
  const [roundIndex, setRoundIndex] = useState(rounds.length - 1);

  const changeRoundHandler = (newRoundIndex: number) => {
    setRoundIndex(newRoundIndex);
  };
  /**@todo URGENT Fix duplicating users bug */
  return (
    <>
      <div>
        <Leaderboard rounds={rounds} roundIndex={roundIndex} />
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
