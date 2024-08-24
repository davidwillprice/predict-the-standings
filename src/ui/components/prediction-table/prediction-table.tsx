import type {
  Entrants,
  LocalSeasonData,
  ShortHandCompStr,
  UserGameData,
} from "@custom-types/game-types";
import { calcPredictionsAccuracy } from "@lib/game-data";

import { EntrantTable } from "@components/entrant-table/entrant-table";

interface Props {
  currentUserId: string | undefined;
  currentUserDisplayName: string | undefined;
  entrantType: string;
  entrants: Entrants;
  localSeasonData: LocalSeasonData;
  roundIndex: number;
  selectedUser: UserGameData;
  shortHandCompStr: ShortHandCompStr;
}

export const PredictionTable = ({
  currentUserId,
  currentUserDisplayName,
  entrants,
  entrantType,
  localSeasonData,
  roundIndex,
  selectedUser,
  shortHandCompStr,
}: Props) => {
  const tableData = selectedUser.season[entrantType][roundIndex].diffs;
  if (!tableData)
    throw new Error(
      `Couldn't obtain table data for ${selectedUser.displayName}`
    );
  const accuracy = calcPredictionsAccuracy(
    selectedUser.predictions[entrantType].length,
    selectedUser.season[entrantType][roundIndex].diffTotal,
    localSeasonData,
    selectedUser.displayName
  );
  return (
    <EntrantTable
      accuracy={accuracy}
      entrantArr={tableData.map((rowData) => entrants[rowData.entrantId])}
      heading={`${
        selectedUser._id.toString() === currentUserId
          ? currentUserDisplayName
          : selectedUser.displayName
      } Predictions`}
      posDiffArr={tableData.map((rowData) => rowData.posDiff)}
      shortHandCompStr={shortHandCompStr}
    />
  );
};
