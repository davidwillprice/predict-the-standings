import type { Entrant, F1DriverEntrant } from "@custom-types/entrants";

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

//3 as e
//1 as i
//0 as o
//7 as 1
//5 as s
//9 as g
//Catch capital letters as non-capital letters and vice versa
/**@todo Finish variationCatcher */
const variationCatcher = (stringArr: string[], no: number, letter: string) => {
  const filteredStringArr = stringArr.filter((word) => word.includes(letter));
  filteredStringArr.forEach((word) => {
    const letterCount = word.replace(`/[^${letter}]/g`, "").length;

    let newVariations = [];

    // for (let i = 0; i < word.length; i++) {
    //   if (word[i] === letter) {
    //     newVariations.push(word.slice(0, i) + no + word.slice(i + 1));
    //   }
    // }

    // for (let i = 0; i < letterCount; i++) {
    //   newVariations.forEach((variation) => {
    //     for (let i = 0; i < variation.length; i++) {
    //       if (variation[i] === letter) {
    //         //newVariations.push(variation.slice(0, i) + no + variation.slice(i + 1));
    //       }
    //     }
    //   });
    // }

    //Needs to go through and return an array of variations where each letter is replaced with a number in turn
    //And then go through through those new variations again and agian
    //Then add all these new variations to the main stringArr

    //But does this cover all variations of variations?
  });
};
