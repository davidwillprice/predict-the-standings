import { numberToOrdinalNumber } from "@lib/misc";

import { Round, Entrant, Entrants } from "@custom-types/game-types";

interface Props {
  entrants: { [key: string]: Entrants };
  isSeasonOver: Boolean;
  rounds: Round[];
}

/**Populates an array with the most and least accurate entrants of all types using a class, then renders bullet points of them */
export const EntrantAccuracy = ({ entrants, isSeasonOver, rounds }: Props) => {
  const mostRecentRound = rounds[rounds.length - 1];
  /**@todo Add round slider to see how accuracies changed? */
  class MostOrLeastAccEntrant {
    avgMisposition: number;
    accType: "most" | "least";
    entrant: Entrant;
    entrantType: string;
    constructor(
      entrant: Entrant,
      diffTotal: number,
      accType: "most" | "least",
      entrantType: string
    ) {
      this.entrant = entrant;
      this.avgMisposition =
        Math.ceil(
          (diffTotal / mostRecentRound.leaderboards[entrantType].length) * 10
        ) / 10;
      this.accType = accType;
      this.entrantType = entrantType;
    }
  }

  let mostOrLeastAccEntrants = [];
  for (const [entrantType, entrantDiffTotals] of Object.entries(
    mostRecentRound.entrantDiffTotals
  )) {
    const mostAccEntrantId = entrantDiffTotals[0].entrant;

    mostOrLeastAccEntrants.push(
      new MostOrLeastAccEntrant(
        entrants[entrantType][mostAccEntrantId],
        entrantDiffTotals[0].diffTotal,
        "most",
        entrantType
      )
    );

    const leastAccEntrantId =
      entrantDiffTotals[entrantDiffTotals.length - 1].entrant;

    mostOrLeastAccEntrants.push(
      new MostOrLeastAccEntrant(
        entrants[entrantType][leastAccEntrantId],
        entrantDiffTotals[entrantDiffTotals.length - 1].diffTotal,
        "least",
        entrantType
      )
    );
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
