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
  predictionsMadeFor: {
    [competition: string]: { season: string; _id: string }[];
  };
}
