import type { Entrant, User } from "@custom-types/game-types";

export const sortEntrantsAlphabetically = (entrantArr: Entrant[]) => {
  return entrantArr.sort((a, b) =>
    a.name < b.name ? -1 : a.name > b.name ? 1 : 0
  );
};
export const sortUsersAlphabetically = (userArr: User[]) => {
  return userArr.sort((a, b) =>
    a.displayName < b.displayName ? -1 : a.displayName > b.displayName ? 1 : 0
  );
};

/**
 * @returns Strings with commas and 'and' between them
 */
export const formatArrayIntoList = (arr: string[]): string => {
  if (arr.length === 1) return arr[0];

  arr[arr.length - 1] = "and " + arr[arr.length - 1];
  if (arr.length === 2) {
    arr = [arr.join(" ")];
  } else {
    arr = [arr.join(", ")];
  }
  return arr.join();
};

export const calcPercentile = (arr: number[], val: number): number => {
  let count = 0;
  arr.forEach((v) => {
    if (v < val) {
      count++;
    } else if (v == val) {
      count += 0.5;
    }
  });
  return (100 * count) / arr.length;
};

export const numberToOrdinalNumber = (number: number): string => {
  const lastNumberOfPos = number.toString().slice(-1);
  return (
    number +
    (lastNumberOfPos === "1"
      ? "st"
      : lastNumberOfPos === "2"
      ? "nd"
      : lastNumberOfPos === "3"
      ? "rd"
      : "th")
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
