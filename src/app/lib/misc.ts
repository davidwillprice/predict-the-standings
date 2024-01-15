import type { Entrant, F1DriverEntrant } from "../data/formula-1/2023";

export const sortEntrantsAlphabetically = (entrantArr: Entrant[]) => {
  return entrantArr.sort((a, b) =>
    a.name < b.name ? -1 : a.name > b.name ? 1 : 0
  );
};
export const sortF1DriverEntrantsAlphabetically = (
  entrantArr: F1DriverEntrant[]
) => {
  return entrantArr.sort((a, b) =>
    a.name < b.name ? -1 : a.name > b.name ? 1 : 0
  );
};
