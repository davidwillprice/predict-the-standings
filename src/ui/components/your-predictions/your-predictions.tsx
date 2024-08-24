import { getUserGameDataQuery } from "@lib/db-functions";

import styles from "@components/entrant-table/entrant-table.module.scss";

import { Entrant, LocalSeasonData } from "@custom-types/game-types";
import { EntrantTable } from "@components/entrant-table/entrant-table";
import { UserDataFromSession } from "@custom-types/misc";

interface Props {
  seasonData: LocalSeasonData;
  currUser: UserDataFromSession;
}

export const YourPredictions = async ({ seasonData, currUser }: Props) => {
  const { allEntrants, competitionStrs, id: seasonStr } = seasonData;

  const noOfEntrantTypes = Object.keys(allEntrants).length;

  let userPredictions: { [entrantType: string]: Entrant[] } = {};

  try {
    const userGameData = await getUserGameDataQuery(
      seasonStr,
      competitionStrs.shortHand,
      currUser.id
    );

    /**If their gameData has been successfully obtained,turn its prediction arrays of entrantIds into Entrant arrays using the local season data */
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
