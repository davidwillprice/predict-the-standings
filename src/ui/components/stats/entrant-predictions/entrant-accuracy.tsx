import { Round, Entrant } from "@custom-types/game-types";

interface Props {
  rounds: Round[];
  isSeasonOver: Boolean;
}

/**Populates an array with the most and least accurate entrants of all types using a class, then renders bullet points of them */
export const EntrantAccuracy = ({ rounds, isSeasonOver }: Props) => {
  const mostRecentRound = rounds[rounds.length - 1];

  class MostOrLeastAccEntrant {
    entrant: Entrant;
    avgMisposition: number;
    accType: "most" | "least";
    entrantType: string;
    constructor(
      entrant: Entrant,
      diffTotal: number,
      accType: "most" | "least",
      entrantType: string
    ) {
      this.entrant = entrant;
      this.avgMisposition =
        Math.round(
          (diffTotal / mostRecentRound.leaderboards[entrantType].length) * 10
        ) / 10;
      this.accType = accType;
      this.entrantType = entrantType;
    }
  }

  let mostOrLeastAccEntrants = [];
  for (const [entrantType, entrants] of Object.entries(
    mostRecentRound.entrantDiffTotals
  )) {
    mostOrLeastAccEntrants.push(
      new MostOrLeastAccEntrant(
        entrants[0].entrant,
        entrants[0].diffTotal,
        "most",
        entrantType
      )
    );
    mostOrLeastAccEntrants.push(
      new MostOrLeastAccEntrant(
        entrants[entrants.length - 1].entrant,
        entrants[entrants.length - 1].diffTotal,
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
            accurately predicted ${entrantType} (on avg ${
              avgMisposition === 0 ? 0.1 : avgMisposition
            } position${avgMisposition !== 1 ? "s" : ""} off).`}
          </li>
        );
      })}
    </ul>
  );
};
