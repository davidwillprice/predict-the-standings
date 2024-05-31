import { numberToOrdinalNumber } from "@lib/misc";

import { Round, Entrant, Entrants } from "@custom-types/game-types";

interface Props {
  entrants: { [key: string]: Entrants };
  isSeasonOver: Boolean;
  noOfPredictions: { [key: string]: number };
  rounds: Round[];
}

export const EntrantAccuracy = ({
  entrants,
  isSeasonOver,
  noOfPredictions,
  rounds,
}: Props) => {
  /**@todo Add round slider to see how accuracies changed? */
  const mostRecentRound = rounds[rounds.length - 1];

  /**Adds the most and least accurate entrants for each entrant type to an array, ready to render a bullet point for each of them */
  let mostOrLeastAccEntrants = [];
  for (const [entrantType, entrantAccuracyObj] of Object.entries(
    mostRecentRound.accurateEntrants
  )) {
    for (const [key, entrantData] of Object.entries(entrantAccuracyObj)) {
      const accType = key === "most" ? "most" : "least";
      mostOrLeastAccEntrants.push({
        avgMisposition:
          Math.ceil(
            (entrantData.diffTotal / noOfPredictions[entrantType]) * 10
          ) / 10,
        entrant: entrants[entrantType][entrantData.entrantId],
        diffTotal: entrantData.diffTotal,
        accType: accType,
        entrantType: entrantType,
      });
    }
  }

  return (
    <ul>
      {mostOrLeastAccEntrants.map((entrantData) => {
        const { entrant, entrantType, accType, avgMisposition } = entrantData;
        return (
          <li key={entrant.name}>
            {`${entrant.name} ${isSeasonOver ? "was" : "is"} the ${accType} 
            accurately predicted ${entrantType} (${
              avgMisposition === 0
                ? `everyone correctly predicted they would ${
                    isSeasonOver ? "finish" : "be"
                  } ${numberToOrdinalNumber(
                    entrant.predictionedPositions.indexOf(100) + 1
                  )}).`
                : `on avg ${avgMisposition} position${
                    avgMisposition !== 1 ? "s" : ""
                  } off).`
            }`}
          </li>
        );
      })}
    </ul>
  );
};
