import { getSingleUserPredictionDataQuery } from "@lib/db-functions";

import styles from "@components/entrant-table/entrant-table.module.scss";

import { Entrant, LocalSeasonData } from "@custom-types/game-types";
import { EntrantTable } from "@components/entrant-table/entrant-table";

interface Props {
  seasonData: LocalSeasonData;
  userId: string;
}

export const YourPredictions = async ({ seasonData, userId }: Props) => {
  const { allEntrants, competitionStrs, id } = seasonData;

  const noOfEntrantTypes = Object.keys(allEntrants).length;

  let userPredictions: { [entrantType: string]: Entrant[] } = {};

  try {
    /**Obtain userGamedata */
    const userGameData = await getSingleUserPredictionDataQuery(
      id,
      competitionStrs.shortHand,
      userId
    );
    /**Turn prediction arrays of entrantIds into Entrant arrays using the local season data */
    for (const [entrantType, entrantIdArr] of Object.entries(
      userGameData.predictions
    )) {
      userPredictions[entrantType] = entrantIdArr.map(
        (entrantId) => allEntrants[entrantType][entrantId]
      );
    }
  } catch (_) {
    new Error("Couldn't obtain your predictions");
  }
  return (
    <div className={styles.multi_table_con}>
      {Object.keys(userPredictions).map((entrantType) => (
        <EntrantTable
          entrantArr={userPredictions[entrantType]}
          isFullWidth={true}
          key={entrantType}
          isTwoColumns={noOfEntrantTypes === 1}
          shortHandCompStr={competitionStrs.shortHand}
        />
      ))}
    </div>
  );
};
