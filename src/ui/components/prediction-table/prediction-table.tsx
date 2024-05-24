import type {
  Entrants,
  ShortHandCompStr,
  UserGameData,
} from "@custom-types/game-types";
import { calcPredictionsAccuracy } from "@lib/game-data";

import { EntrantTable } from "@components/entrant-table/entrant-table";

interface Props {
  currentUserId: string | null;
  currentUserDisplayName: string | null;
  entrantType: string;
  entrants: Entrants;
  selectedRound: number;
  selectedUser: UserGameData;
  shortHandCompStr: ShortHandCompStr;
}

export const PredictionTable = ({
  currentUserId,
  currentUserDisplayName,
  entrants,
  entrantType,
  selectedRound,
  selectedUser,
  shortHandCompStr,
}: Props) => {
  const tableData = selectedUser.season[entrantType][selectedRound].diffs;
  const accuracy = calcPredictionsAccuracy(
    selectedUser.predictions[entrantType].length,
    selectedUser.season[entrantType][selectedRound].diffTotal
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
