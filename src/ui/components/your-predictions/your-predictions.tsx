import { getSingleUserPredictionDataQuery } from "@lib/db-functions";

import { FlagCell } from "@components/prediction-table/eurovision-flag-cell";

import predictionTableStyles from "@components/prediction-table/prediction-table.module.scss";
import styles from "@components/submit-predictions/editable-prediction-table.module.scss";

import {
  Entrant,
  LocalSeasonData,
  ShortHandCompStr,
} from "@custom-types/game-types";

interface Props {
  seasonData: LocalSeasonData;
  userId: string;
}

export const YourPredictions = async ({ seasonData, userId }: Props) => {
  const { allEntrants, competitionStrs, id } = seasonData;

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
    <div
      className={`${predictionTableStyles.prediction_table} ${
        styles.editable_prediction_table
      } ${
        Object.keys(userPredictions).length === 1
          ? styles.single_entrant_type_table
          : ""
      }`}
      style={{ maxWidth: "800px", margin: "0 auto 30px" }}>
      {Object.keys(userPredictions).map((entrantType) => (
        <PredictionTable
          key={entrantType}
          predictionArr={userPredictions[entrantType]}
          shortHandCompStr={competitionStrs.shortHand}
        />
      ))}
    </div>
  );
};

interface TableProps {
  predictionArr: Entrant[];
  shortHandCompStr: ShortHandCompStr;
}
/**@todo Need to adjust styling if there is two entrantTypes */
const PredictionTable = ({ predictionArr, shortHandCompStr }: TableProps) => (
  <table>
    <tbody
      style={{
        gridTemplateRows: `repeat(${Math.ceil(
          predictionArr.length / 2
        )}, auto)`,
      }}>
      {predictionArr.map((entrant, index) => (
        <tr
          key={entrant.sName}
          className={`${predictionTableStyles.table_row} ${styles.table_row}`}>
          <td className={predictionTableStyles.position_cell}>
            {index !== null ? index + 1 : " "}
          </td>
          {shortHandCompStr === "eurovision" ? (
            <FlagCell name={entrant.name} sName={entrant.sName} />
          ) : (
            <td className={predictionTableStyles.flair_cell}>
              <span
                className={`${predictionTableStyles.flair}`}
                style={{ backgroundColor: entrant.color }}></span>
            </td>
          )}
          <td
            className={`${predictionTableStyles.name_cell} ${
              entrant.name.length > 11 && predictionTableStyles.large_name
            }`}>
            <span className={predictionTableStyles.name}>{entrant.name}</span>
            <span className={predictionTableStyles.sName}>{entrant.sName}</span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
