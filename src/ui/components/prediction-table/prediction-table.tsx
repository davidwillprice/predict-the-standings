import type {
  Entrants,
  Round,
  ShortHandCompStr,
  UserGameData,
} from "@custom-types/game-types";
import {
  calcPredictionsAccuracy,
  calcUserRoundPerformance,
} from "@lib/game-data";

import { EntrantTable } from "@components/entrant-table/entrant-table";

interface Props {
  currentUserId: string | null;
  currentUserDisplayName: string | null;
  entrantType: string;
  entrants: Entrants;
  round: Round;
  roundIndex: number;
  selectedUser: UserGameData;
  shortHandCompStr: ShortHandCompStr;
}

export const PredictionTable = ({
  currentUserId,
  currentUserDisplayName,
  entrants,
  entrantType,
  round,
  roundIndex,
  selectedUser,
  shortHandCompStr,
}: Props) => {
  /**Repopulate 'diffs' array and 'diffTotal' for user.season[entrantType][roundIndex]*/
  selectedUser = calcUserRoundPerformance(
    entrantType,
    selectedUser,
    round,
    roundIndex
  );

  const tableData = selectedUser.season[entrantType][roundIndex].diffs;
  if (!tableData)
    throw new Error(
      `Couldn't obtain table data for ${selectedUser.displayName}`
    );
  const accuracy = calcPredictionsAccuracy(
    selectedUser.predictions[entrantType].length,
    selectedUser.season[entrantType][roundIndex].diffTotal
  );
  return (
    <EntrantTable
      accuracy={accuracy}
      entrantArr={tableData.map((rowData) => entrants[rowData.entrantId])}
      heading={`${
        selectedUser.id.toString() === currentUserId
          ? currentUserDisplayName
          : selectedUser.displayName
      } Predictions`}
      posDiffArr={tableData.map((rowData) => rowData.posDiff)}
      shortHandCompStr={shortHandCompStr}
    />
  );
};
