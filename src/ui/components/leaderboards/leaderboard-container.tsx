"use client";

import { Leaderboard } from "./leaderboard";

import { Round, Users } from "@custom-types/game-types";

interface Props {
  rounds: Round[];
  users: Users;
}

export const LeaderboardContainer = ({ rounds, users }: Props) => {
  return <Leaderboard rounds={rounds} roundIndex={0} />;
};
