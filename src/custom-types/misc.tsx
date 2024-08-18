import { IconType } from "@ui/svgs/icons/sq-icon";

export interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
  params: { [key: string]: string };
}
export class CompetitionLink {
  href: string;
  icon: IconType;
  text: string;
  constructor(href: string, icon: IconType, text: string) {
    this.href = href;
    this.icon = icon;
    this.text = text;
  }
}

export interface UserDataFromSession {
  id: string;
  email?: string;
  displayName: string;
  lastDisplayNameSubmission: number | Date | undefined;
  /**Former is new type from 8/2024 where the userId is used for all gamedata _id, the latter is the old type which some people might still have if they haven't logged out/in since then */
  predictionsMadeFor: {
    [competition: string]: string[] | { season: string; _id: string }[];
  };
}

export const isNewPredictionMadeForArr = (
  arr: string[] | { season: string; _id: string }[]
): arr is string[] => {
  return typeof arr[0] === "string";
};
