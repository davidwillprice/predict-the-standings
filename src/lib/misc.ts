import type {
  CollectionObj,
  Entrant,
  ShortHandCompStr,
  UserGameDataMap,
} from "@custom-types/game-types";
import { UserGameData } from "@custom-types/game-types";
import { UserDataFromSession } from "@custom-types/misc";
import { WithId } from "mongodb";

export const sortEntrantsAlphabetically = (entrantArr: Entrant[]) => {
  return entrantArr.sort((a, b) =>
    a.name < b.name ? -1 : a.name > b.name ? 1 : 0
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

export const getObjFileSize = (obj: object) => {
  const size = new TextEncoder().encode(JSON.stringify(obj)).length;
  console.log(size / 1024 + "kb");
};

/**If they are in the arr, brings the current user to the front of a UserGameData arr */
export const bringCurrUserToFrontOfArr = (
  currUser: UserGameData | null,
  userArr: UserGameData[]
): UserGameData[] => {
  /**If there is no current user, return the arr as is */
  if (currUser === null) return userArr;
  const indexOfCurrUser = userArr.findIndex(
    (user) => user.userId === currUser.userId
  );
  /**If the current user is in the arr, bring them to the front of the arr */
  if (indexOfCurrUser !== -1) {
    userArr.unshift(userArr.splice(indexOfCurrUser, 1)[0]);
  }
  return userArr;
};

let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

export function debounce<Args extends any[]>(
  func: (...args: Args) => void,
  delay: number
): (...args: Args) => void {
  return (...args: Args) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    debounceTimeout = setTimeout(() => {
      func(...args);
      debounceTimeout = null;
    }, delay);
  };
}

export const toTitleCase = (str: string) => {
  // Split the string into an array of words
  const words = str.toLowerCase().split(" ");

  // Capitalize the first letter of each word and join them back into a string
  const titleCaseStr = words
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");

  return titleCaseStr;
};

export const markdownLinksToHTML = (text: string): string => {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;

  return text.replace(regex, (match, linkText, linkUrl) => {
    return `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
  });
};

export const getLengthOfLongestConsecutiveNumbers = (arr: number[]): number => {
  let longestStreak = 1;
  let currentStreak = 1;
  arr.forEach((round, index) => {
    if (index !== 0) {
      if (round === arr[index - 1] + 1) {
        currentStreak++;
        if (currentStreak > longestStreak) longestStreak = currentStreak;
      } else {
        currentStreak = 1;
      }
    }
  });
  return longestStreak;
};

/**Convert strings from `predictionsMadeFor` via the user session into collection game data names*/
export const getCollectionObjFromPredictionsMadeFor = (
  user: UserDataFromSession
): CollectionObj[] | null => {
  if (
    !user.predictionsMadeFor ||
    Object.values(user.predictionsMadeFor).length === 0
  ) {
    return null;
  }

  let gameDataCollectionObjArr: CollectionObj[] = [];

  for (const [competition, seasonArr] of Object.entries(
    user.predictionsMadeFor
  )) {
    seasonArr.forEach((seasonObj) => {
      gameDataCollectionObjArr.push({
        collectionName: competition + seasonObj.season,
        _id: seasonObj._id,
      });
    });
  }
  return gameDataCollectionObjArr;
};

export const convertDocArrToUserGameDataMap = (
  docArr: WithId<UserGameData>[]
): UserGameDataMap => {
  const users: UserGameDataMap = {};
  for (const doc of docArr) {
    users[doc.userId] = convertDocumentToUserGameData(doc);
  }
  return users;
};

export const convertDocumentToUserGameData = (
  doc: WithId<UserGameData>
): UserGameData => {
  /**I can't use new UserGameData() as it gives a `Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported.` error as it's upset about a class instance being returned. If I use `JSON.parse(JSON.stringify(userGameData))` then I lose the Date type of lastSubmissionTime
   */
  const userGameData: UserGameData = {
    _id: doc._id.toString(),
    displayName: doc.displayName,
    lastSubmissionTime: doc.lastSubmissionTime,
    predictions: doc.predictions,
    userId: doc.userId,
    userType: doc.userType,
    season: {},
    controversyPercentile: {},
    predictionsFromAvg: {},
  };
  if (doc.roundsTop) userGameData.roundsTop = doc.roundsTop;
  if (doc.predictionsFromAvg)
    userGameData.predictionsFromAvg = doc.predictionsFromAvg;
  if (doc.timesPredictionsUpdated)
    userGameData.timesPredictionsUpdated = doc.timesPredictionsUpdated;
  if (doc.controversyPercentile)
    userGameData.controversyPercentile = doc.controversyPercentile;
  if (doc.season) userGameData.season = doc.season;
  // if (doc.leaderboardPositions)
  //   userGameData.leaderboardPositions = doc.leaderboardPositions;
  if (doc.information) userGameData.information = doc.information;
  return userGameData;
};

export const getSpecificGameDataIdFromSessionUser = (
  seasonStr: string,
  shortHandCompStr: ShortHandCompStr,
  user: UserDataFromSession | undefined
): string | undefined => {
  if (!user || !user.predictionsMadeFor[shortHandCompStr]) {
    return undefined;
  } else {
    return user.predictionsMadeFor[shortHandCompStr].find(
      (seasonObj) => seasonObj.season === seasonStr
    )?._id;
  }
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
